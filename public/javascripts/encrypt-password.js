function encrypt(key, value) {
  var result="";
  for(i=0;i<value.length;++i)
  {
    result+=String.fromCharCode(key[i % key.length]^value.charCodeAt(i));
  }
  return result;
}

function decrypt(key, value)
{
 var result="";
  for(i=0;i<value.length;++i)
  {
    result+=String.fromCharCode(key[i % key.length]^value.charCodeAt(i));
  }
  return result;
}
