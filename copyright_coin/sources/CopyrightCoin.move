//:!:>copyrigh_coin
module CopyrightCoin::copyright_coin {

    use aptos_framework::coin;
    use std::option;
    use std::signer;
    use aptos_framework::coin::{BurnCapability};
    use std::string::utf8;
    use aptos_std::math64;

    struct CopyrightCoin {}

    const OWNER:address = @CopyrightCoin;
    const TOTAL_COINS: u64 = 500000000;

    const INVALID_OWNER:u64 = 1;

    struct BurnCap<phantom CoinType> has key {
        burn_cap:BurnCapability<CoinType>
    }


    fun init_module(sender: &signer) {

        let sender_address = signer::address_of(sender);
        let (burn_cap, freeze_cap, mint_cap) =  coin::initialize<CopyrightCoin>(
            sender,
            utf8(b"Copyright"),
            utf8(b"COPY"),
            6,
            true,
        );

        if(!coin::is_account_registered<CopyrightCoin>(sender_address)){
            coin::register<CopyrightCoin>(sender);
        };

        move_to(sender,BurnCap{
            burn_cap
        });

        let _total_amount_mint = TOTAL_COINS * math64::pow(10,8);
        let supply = coin::supply<CopyrightCoin>();
        assert!(option::is_some(&supply), 1);
        let coins =  coin::mint(_total_amount_mint,&mint_cap);
        coin::deposit(sender_address,coins);
        coin::destroy_mint_cap(mint_cap);
        coin::destroy_freeze_cap(freeze_cap);
    }

    public entry fun burn_coin(sender:&signer, amount:u64) acquires BurnCap {
        let sender_address = signer::address_of(sender);
        assert!(sender_address == OWNER, INVALID_OWNER);
        let amount_burn = amount * math64::pow(10,8);
        let burn_cap = borrow_global_mut<BurnCap<CopyrightCoin>>(sender_address);
        let coins = coin::withdraw<CopyrightCoin>(sender,amount_burn);
        coin::burn(coins,&burn_cap.burn_cap);
    }
}
//<:!:copyrigh_coin

