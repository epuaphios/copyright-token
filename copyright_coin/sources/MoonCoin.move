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
}
//<:!:moon
