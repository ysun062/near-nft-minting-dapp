import { NearBindgen, near, call, view, LookupMap, initialize } from 'near-sdk-js';

class Token {
  token_id: number;
  owner_id: string;
  name: string;
  description: string;
  media_uri: string;
  level: number;

  constructor(token_id: number, owner_id: string, name: string, description: string, media_uri: string, level: number) {
    this.token_id = token_id;
    this.owner_id = owner_id;
    this.name = name;
    this.description = description;
    this.media_uri = media_uri;
    this.level = level;
  }


}
@NearBindgen({})
class NFTMinting {
  owner_id: string;
  owner_by_id: LookupMap;
  token_id: number;
  token_by_id: LookupMap;

  constructor() {
    this.owner_id = "";
    this.owner_by_id = new LookupMap("n");
    this.token_id = 0;
    this.token_by_id = new LookupMap("t");
  }

  @initialize({})
  init({owner_id, prefix}){
    this.owner_id = owner_id;
    this.owner_by_id = new LookupMap(prefix);
    this.token_id = 0;
    this.token_by_id = new LookupMap("t");
  }
  
  @call({})
  mint_nft({token_owner_id, name, description, media_uri, level}) {
    this.owner_by_id.set(this.token_id.toString(), token_owner_id);

    let token = new Token(this.token_id, token_owner_id, name, description, media_uri, level);
    this.token_by_id.set(this.token_id.toString(), token);
    this.token_id++;

    return token;
  }

  @view({})
  get_token_by_id({token_id, name, description, media_uri, level}) {
    let token = this.token_by_id.get(token_id.toString());
    if (token === null) {
      return null;
    }
    return token;
  }

  @view({})
  get_total_tokens({}) {
    return this.token_id;
  }

  @view({})
  get_all_tokens({}) {
    var all_tokens = [];
    for (var index = 0; index < this.token_id; index++) {
      all_tokens.push(this.token_by_id.get(index.toString()));
    }

    return all_tokens;
  }

}