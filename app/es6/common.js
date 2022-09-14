
if(! Promise.Deferred){
  Promise.Deferred = function() {
    this.promise = new Promise((function(resolve, reject) {
      this.resolve = resolve;
      this.reject = reject;
    }).bind(this));

    this.then = this.promise.then.bind(this.promise);
    this.catch = this.promise.catch.bind(this.promise);
  };
}
