export var providers = ($http) => {

  class DataProvider {
    constructor(basePath){
      this.basePath = basePath;
      this.cache = {};
    }

    getUrl(path){
      return this.basePath + path;
    }

    get(path, params){
      return $http.get(this.getUrl(path), params)
    }

    post(path, params){
      return $http.post(this.getUrl(path), params)
    }

    login(email, password){
      return this.post('/login', {email, password})
    }

    logout(){
      return this.get('/logout')
    }

    me(){
      return this.get('/me');
    }

    sessions(){
      return this.get('/sessions');
    }

    saveSession(session){
      var createMode = (session.key)?false:true;
      var path = '/sessions';

      if(!createMode){
        path += '/' + session.key + '/edit';
      }

      return this.post(path, session);
    }

    deleteSession(session){
      var path = '/sessions/'+ session.key + '/delete';

      return this.post(path, session);
    }

    getSession(sessionkey, sharekey){
      var url = '/sessions/' + sessionkey;
      if(sharekey){
        url += '?shareKey=' + sharekey;
      }

      return this.get(url)
    }


    copySession(sessionkey, sharekey){
      var path = '/sessions/' + sessionkey + '/copy?shareKey=' + sharekey;
      return this.post(path);
    }

    saveSessionDrill(sessionkey, drill){
      var path = "/drills/" + drill.key + '/edit?sessionKey=' + sessionkey;
      return this.post(path, drill);
    }

    saveDrill(drill, sessionKey){
      var createMode = (drill.key)?false:true;
      var path = '/drills';

      if(!createMode){
        path += '/' + drill.key + '/edit';
      }

      if(sessionKey){
        path += '?sessionKey=' + sessionKey;
      }
      return this.post(path, drill);
    }


    getDrill(sessionkey, drillkey, sharekey){
      if(sessionkey){
        var url = '/sessions/' + sessionkey + '/drills/' + drillkey + '/';
      }else{
        var url = '/drills/' + drillkey + '/';
        if(sharekey){
          url += '?shareKey=' + sharekey;
        }
      }
      return this.get(url);
    }

    copyDrill(drillkey, shareKey){
      return this.post('/drills/' + drillkey + '/copy?shareKey=' + shareKey);
    }

    deleteDrill(sessionkey, drill){
      var path = '/drills/' + drill.key + '/delete';

      if(sessionkey){
        path += '?sessionKey=' + sessionkey;
        path += '&removeFromSession=' + true;
        path += '&orderIndex=' + drill.orderIndex;
      }

      return this.post(path, drill);
    }

    attachDrill(sessionkey, drillkey, params){
      var params = params || {};
      var path = '/sessions/' + sessionkey + '/attach/' + drillkey;
      return this.post(path, params);
    }

    translations(){
      return this.get('/_admin/translations');
    }

    getTranslationsLang(lang){
      return this.get('/_admin/translations/' + lang);
    }

    createTranslationsLang(lang){
      return this.post('/_admin/translations', {lang:lang});
    }

    saveTranslationsLang(lang, items){
      return this.post('/_admin/translations/' + lang, {items:items});
    }

    syncTranslationsLang(lang){
      return this.post('/_admin/translations/' + lang + '/sync');
    }

  }

  return {
    DataProvider
  }
}
