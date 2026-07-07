#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, String, Vec, symbol_short,
};

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum MilestoneStatus {
    Pending,
    Submitted,
    Released,
}

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum AgreementStatus {
    Active,
    Completed,
}

#[contracttype]
#[derive(Clone)]
pub struct Milestone {
    pub description: String,
    pub amount: i128,
    pub status: MilestoneStatus,
}

#[contracttype]
#[derive(Clone)]
pub struct Agreement {
    pub client: Address,
    pub contractor: Address,
    pub token: Address,
    pub total_amount: i128,
    pub milestones: Vec<Milestone>,
    pub status: AgreementStatus,
}

#[contracttype]
pub enum DataKey {
    Agreement,
}

#[contract]
pub struct WorkAgreementContract;

#[contractimpl]
impl WorkAgreementContract {
    pub fn init_agreement(
        env: Env,
        client: Address,
        contractor: Address,
        token: Address,
        total_amount: i128,
        milestone_descriptions: Vec<String>,
        milestone_amounts: Vec<i128>,
    ) -> bool {
        client.require_auth();

        let count = milestone_descriptions.len();
        let mut milestones: Vec<Milestone> = Vec::new(&env);
        let mut i = 0u32;
        while i < count {
            milestones.push_back(Milestone {
                description: milestone_descriptions.get(i).unwrap(),
                amount: milestone_amounts.get(i).unwrap(),
                status: MilestoneStatus::Pending,
            });
            i += 1;
        }

        token::Client::new(&env, &token)
            .transfer(&client, &env.current_contract_address(), &total_amount);

        let agreement = Agreement {
            client: client.clone(),
            contractor: contractor.clone(),
            token,
            total_amount,
            milestones,
            status: AgreementStatus::Active,
        };

        env.storage()
            .persistent()
            .set(&DataKey::Agreement, &agreement);

        env.events().publish(
            (symbol_short!("init"), symbol_short!("agree")),
            (client, contractor, total_amount),
        );

        true
    }

    pub fn submit_milestone(env: Env, contractor: Address, milestone_index: u32) -> bool {
        contractor.require_auth();

        let mut agreement: Agreement = env
            .storage()
            .persistent()
            .get(&DataKey::Agreement)
            .unwrap();

        assert!(agreement.contractor == contractor, "Not the contractor");
        assert!(
            agreement.status == AgreementStatus::Active,
            "Agreement not active"
        );

        let mut milestone = agreement.milestones.get(milestone_index).unwrap();
        assert!(
            milestone.status == MilestoneStatus::Pending,
            "Milestone not pending"
        );

        milestone.status = MilestoneStatus::Submitted;
        agreement.milestones.set(milestone_index, milestone);

        env.storage()
            .persistent()
            .set(&DataKey::Agreement, &agreement);

        env.events().publish(
            (symbol_short!("submit"), symbol_short!("mile")),
            (contractor, milestone_index),
        );

        true
    }

    pub fn release_milestone(env: Env, client: Address, milestone_index: u32) -> bool {
        client.require_auth();

        let mut agreement: Agreement = env
            .storage()
            .persistent()
            .get(&DataKey::Agreement)
            .unwrap();

        assert!(agreement.client == client, "Not the client");
        assert!(
            agreement.status == AgreementStatus::Active,
            "Agreement not active"
        );

        let mut milestone = agreement.milestones.get(milestone_index).unwrap();
        assert!(
            milestone.status == MilestoneStatus::Submitted,
            "Milestone not submitted"
        );

        let amount = milestone.amount;
        let contractor = agreement.contractor.clone();
        let token = agreement.token.clone();

        token::Client::new(&env, &token)
            .transfer(&env.current_contract_address(), &contractor, &amount);

        milestone.status = MilestoneStatus::Released;
        agreement.milestones.set(milestone_index, milestone);

        let total = agreement.milestones.len();
        let mut all_done = true;
        let mut j = 0u32;
        while j < total {
            if agreement.milestones.get(j).unwrap().status != MilestoneStatus::Released {
                all_done = false;
                break;
            }
            j += 1;
        }
        if all_done {
            agreement.status = AgreementStatus::Completed;
        }

        env.storage()
            .persistent()
            .set(&DataKey::Agreement, &agreement);

        env.events().publish(
            (symbol_short!("release"), symbol_short!("mile")),
            (
                client,
                contractor,
                amount,
                milestone_index,
                env.ledger().timestamp(),
            ),
        );

        true
    }

    pub fn get_agreement(env: Env) -> Agreement {
        env.storage()
            .persistent()
            .get(&DataKey::Agreement)
            .unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{
        testutils::Address as _,
        token::{Client as TokenClient, StellarAssetClient},
        Address, Env, String as SorobanString, Vec,
    };

    fn setup_token(
        env: &Env,
        admin: &Address,
    ) -> (Address, TokenClient, StellarAssetClient) {
        let token_id = env.register_stellar_asset_contract_v2(admin.clone());
        let addr = token_id.address();
        let client = TokenClient::new(env, &addr);
        let admin_client = StellarAssetClient::new(env, &addr);
        (addr, client, admin_client)
    }

    #[test]
    fn test_full_flow() {
        let env = Env::default();
        env.mock_all_auths();

        let client_addr = Address::generate(&env);
        let contractor_addr = Address::generate(&env);
        let admin = Address::generate(&env);

        let (token_addr, token_client, token_admin) = setup_token(&env, &admin);
        token_admin.mint(&client_addr, &1000);

        let contract_id = env.register_contract(None, WorkAgreementContract);
        let contract = WorkAgreementContractClient::new(&env, &contract_id);

        let mut descs: Vec<SorobanString> = Vec::new(&env);
        descs.push_back(SorobanString::from_str(&env, "Design mockup"));
        descs.push_back(SorobanString::from_str(&env, "Final delivery"));

        let mut amounts: Vec<i128> = Vec::new(&env);
        amounts.push_back(300_i128);
        amounts.push_back(700_i128);

        contract.init_agreement(
            &client_addr,
            &contractor_addr,
            &token_addr,
            &1000_i128,
            &descs,
            &amounts,
        );

        assert_eq!(contract.get_agreement().status, AgreementStatus::Active);
        assert_eq!(token_client.balance(&contract_id), 1000);

        contract.submit_milestone(&contractor_addr, &0u32);
        assert_eq!(
            contract.get_agreement().milestones.get(0).unwrap().status,
            MilestoneStatus::Submitted
        );

        contract.release_milestone(&client_addr, &0u32);
        assert_eq!(token_client.balance(&contractor_addr), 300);

        contract.submit_milestone(&contractor_addr, &1u32);
        contract.release_milestone(&client_addr, &1u32);

        assert_eq!(token_client.balance(&contractor_addr), 1000);
        assert_eq!(
            contract.get_agreement().status,
            AgreementStatus::Completed
        );
    }

    #[test]
    #[should_panic(expected = "Milestone not submitted")]
    fn test_cannot_release_without_submit() {
        let env = Env::default();
        env.mock_all_auths();

        let client_addr = Address::generate(&env);
        let contractor_addr = Address::generate(&env);
        let admin = Address::generate(&env);

        let (token_addr, _token_client, token_admin) = setup_token(&env, &admin);
        token_admin.mint(&client_addr, &500);

        let contract_id = env.register_contract(None, WorkAgreementContract);
        let contract = WorkAgreementContractClient::new(&env, &contract_id);

        let mut descs: Vec<SorobanString> = Vec::new(&env);
        descs.push_back(SorobanString::from_str(&env, "Task one"));
        let mut amounts: Vec<i128> = Vec::new(&env);
        amounts.push_back(500_i128);

        contract.init_agreement(
            &client_addr,
            &contractor_addr,
            &token_addr,
            &500_i128,
            &descs,
            &amounts,
        );

        contract.release_milestone(&client_addr, &0u32);
    }

    #[test]
    #[should_panic(expected = "Not the contractor")]
    fn test_wrong_contractor_cannot_submit() {
        let env = Env::default();
        env.mock_all_auths();

        let client_addr = Address::generate(&env);
        let contractor_addr = Address::generate(&env);
        let fake = Address::generate(&env);
        let admin = Address::generate(&env);

        let (token_addr, _token_client, token_admin) = setup_token(&env, &admin);
        token_admin.mint(&client_addr, &500);

        let contract_id = env.register_contract(None, WorkAgreementContract);
        let contract = WorkAgreementContractClient::new(&env, &contract_id);

        let mut descs: Vec<SorobanString> = Vec::new(&env);
        descs.push_back(SorobanString::from_str(&env, "Task one"));
        let mut amounts: Vec<i128> = Vec::new(&env);
        amounts.push_back(500_i128);

        contract.init_agreement(
            &client_addr,
            &contractor_addr,
            &token_addr,
            &500_i128,
            &descs,
            &amounts,
        );

        contract.submit_milestone(&fake, &0u32);
    }
}
