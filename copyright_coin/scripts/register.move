//:!:>moon
script {
    fun register(account: &signer) {
        aptos_framework::managed_coin::register<CopyrightCoin::copyright_coin::CopyrightCoin>(account)
    }
}
//<:!:moon
