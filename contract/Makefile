build:
	cargo build --target wasm32-unknown-unknown --release

test:
	cargo test

deploy:
	stellar contract deploy \
		--wasm target/wasm32-unknown-unknown/release/work_agreement.wasm \
		--source-account default \
		--network testnet

fmt:
	cargo fmt
