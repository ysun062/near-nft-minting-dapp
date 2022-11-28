import { tokenToString } from "typescript";

export class Contract{
  wallet;

  constructor({wallet}){
    this.wallet = wallet;
  }

  async get_total_tokens() {
    return await this.wallet.viewMethod({method: "get_total_tokens"});
  }

  async get_all_tokens() {
    return await this.wallet.viewMethod({method: "get_all_tokens"});
  }

  async mint_nft(token_name, description, media_uri, level) {
    return await this.wallet.callMethod({ method: "mint_nft", 
      args: {token_owner_id: this.wallet.accountId,
      name: token_name, description, media_uri, level} });
  }
}