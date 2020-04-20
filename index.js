class AnchorElementHandler {
  constructor(attributeName){
    this.attributeName = attributeName;
   
  }
  element(element) {
    // An incoming element, such as `div`
    const attribute = element.getAttribute(this.attributeName);
    if (attribute) {
      element.setAttribute(
        this.attributeName,
        attribute.replace('https://cloudflare.com', ' https://linkedin.com/in/yashj21')
      );
    }
   
   // console.log(`Incoming element: ${element.tagName}`)
  }

  comments(comment) {
    // An incoming comment
  }

  text(text) {
   const data = text.remove();
   if(text.lastInTextNode){
    text.after("Check out my LinkedIn!!!");
   }
   }
}

/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  //
 // console.log(data);
 // console.log(data.variants[0])
 // 
 console.log(request.headers.get('Cookie'));
  var val = '';
  let id;
  //let isCookieSet = request.header.get('Cookie').length>0?'true':'false';
  if(request.headers.get('Cookie') != null){
    var allCookieArray = request.headers.get('Cookie').split(';');
    for(var i=0; i<allCookieArray.length; i++)
    {
      var temp = allCookieArray[i].trim();
      console.log(temp);
      if (temp.indexOf("0")==0){
      val =  temp.substring(2,temp.length);
        id = 0;
        console.log('there');
    }
      else if(temp.indexOf("1")==0){
      val = temp.substring(2,temp.length);
        id = 1;
      console.log('here');
    }
    }
  }else{
    console.log('this');
      const response =await fetch('https://cfw-takehome.developers.workers.dev/api/variants')
     // .then( response.text());
      //console.log(response);
      const body = await response.text();
      const data = JSON.parse(body);
      id = Math.round(Math.random());
      val = data.variants[id];
      }
      const htm = await fetch(val);
      //const test = await htm.text();
      const tmp= new HTMLRewriter().on('a#url', new AnchorElementHandler('href')).transform(htm);

      const resp =  new Response(await tmp.text(),{headers: { 'content-type': 'text/html', 'Set-Cookie' : [`${id}=${val}`] },});
      return resp;
}
const rewriter = new HTMLRewriter()
  .on('a#url', new AnchorElementHandler('href'));
  addEventListener('fetch', event => {
    //console.log(event.toString());
    event.respondWith(handleRequest(event.request))
  })
