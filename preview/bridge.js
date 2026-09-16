// Only used by the local preview. Not included in the extension package.
window.browser={storage:{local:{
  async get(key){try{return {[key]:JSON.parse(localStorage.getItem('preview:'+key)||'null')};}catch{return {}; }},
  async set(data){for(const [key,value]of Object.entries(data))localStorage.setItem('preview:'+key,JSON.stringify(value));}
}}};
