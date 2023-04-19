//:!:>copyright
module Copyright::copyright_coin {
    struct Copyright {}

    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<Copyright>(
            sender,
            b"copyright Coin",
            b"COPY",
            6,
            false,
        );
    }
}
//<:!:copyright