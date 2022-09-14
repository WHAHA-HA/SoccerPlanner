export default class Config{
  constructor(){
    this.name = 'Session Planner 4.0'
    this.templateBasePath = '/views/'
    this.defaultLocal = 'en'
    this.editorVersion = '4.0.0'

    this.apiBasePath = ''
    this.dataProvider = {}

    this.suportedLocale = [
      {key:'en', name: 'English'},
      {key:'ar', name: 'Arabic (العربية)'},
      {key:'es', name: 'Spanish (Español)'},
      {key:'pt', name: 'Portuguese (Português)'},
      {key:'zh-cn', name: 'Chinese (汉语)'},
    ]

    this.supportedDateLocal = [
      'en',
      'ar',
      'es',
      'pt',
      'pt-br',
      'zh-cn',
    ]
  }
}
