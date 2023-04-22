//:!:>moon
module CopyrightCoin::copyright_coin {
    struct CopyrightCoin {}

    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<CopyrightCoin>(
            sender,
            b"Copyright Coin",
            b"COPY",
            6,
            false,
        );
    }

    fun register(account: &signer) {
        aptos_framework::managed_coin::register<CopyrightCoin::copyright_coin::CopyrightCoin>(account)
    }
}
//<:!:moon
