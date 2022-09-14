export var models = (config) => {
  class User{

    constructor(id=null, name=null, email=null, local=null, logoUrl=null){
      this.id = id;
      this.name = name;
      this.email = email;
      this.local =  'en-US';//local || config.defaultLocal;
      this.logoUrl = logoUrl;
      this.isGuest = (id != null)? false:true;
      this.isDemo = (id != null && id == 52401 )? true : false;
      this._authenticated = false;
    }

    clean(){
      this._authenticated = false;
      this.id = null;
      this.name = null;
      this.email = null;
      this.local = 'en-US';
      this.isGuest = true;
      this.logoUrl = null;
      this.isDemo = null;
    }

    update({id, name, email, local, logoUrl}){
      this.id = id;
      this.name = name;
      this.email = email;
      this.local = local;
      this.logoUrl = logoUrl;
      this.isDemo = (id != null && id == 52401 )? true : false;
      this.isGuest = (id != null)? false:true;
    }

    isLoggedIn(){
      return this.id && (!this.isGuest);
    }

    static createGuest(){
      return new User();
    }

  }

  var ActiveUser = {
    user: User.createGuest(),
    validatedInServer: false,

    isLoggedIn(){
      return this.user.isLoggedIn();
    },

    checkLoginStatus(){
      return new Promise((resolve, reject) => {
        if(this.validatedInServer){
          if(this.user.isLoggedIn()){
            resolve(this.user);
          }else{
            reject(this.user);
          }
        }else{
          config.dataProvider.me().then( (data) => {

            var res = data.data;
            if(res.ok){
              this.validatedInServer = true;
              this.setActiveUser(res.user);
              resolve(this.user);
            }else{
              this.validatedInServer = true;
              this.user.clean();
              reject(res);
            }
          }
          , reject)

        }
      });
    },

    setActiveUser(userObject) {
      this.user.clean();
      this.user.update(userObject);
      return this.user;
    },

    login(email, password) {
      return  new Promise((resolve, reject) => {
        config.dataProvider.login(email, password)
        .then( (data) => {

          var res = data.data;
          if(res.ok){
            this.validatedInServer = false;
            this.checkLoginStatus().then(resolve, reject);
          }else{
            reject(res);
          }
        }
        , reject)
      });
    },

    logout(){
      return  new Promise((resolve, reject) => {
        config.dataProvider.logout()
        .then( (data) => {

          var res = data.data;
          if(res.ok){
            this.validatedInServer = false;
            this.user.clean();
            resolve();
          }else{
            reject(res);
          }
        }
        , reject)
      });
    }

  }

  return {
    User,
    ActiveUser
  }
}

// models.$inject = ['config']
