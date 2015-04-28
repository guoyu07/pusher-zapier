/*** Crypto Wrappers ***/
var crypto = {

  createHash: function( type ) {
    if( type !== 'md5' ) {
      throw 'md5 hash only supported';
    }

    return new md5Wrapper();
  },

  createHmac: function( type, secret ) {
    if( type !== 'sha256' ) {
      throw 'sha256 only supported';
    }

    return new hmacWrapper( secret );
  }

};

function md5Wrapper() {

  this.update = function( str ) {
    this.hash = CryptoJS.MD5( str );
    return this;
  };

  this.digest = function( type ) {
    if( type !== 'hex' ) {
      throw 'only hex supported';
    }
    return this.hash.toString( CryptoJS.enc.Hex );
  };
}

function hmacWrapper( secret ) {
  this.secret = secret;

  this.update = function( str ) {
    this.str = str;
    return this;
  };

  this.digest = function( type ) {
    if( type !== 'hex' ) {
      throw 'only hex supported';
    }
    return CryptoJS.HmacSHA256( this.str, this.secret ).toString( CryptoJS.enc.Hex );
  };
}
