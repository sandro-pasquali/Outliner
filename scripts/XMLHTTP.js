
function XMLHTTP() 
/*
 * Interface to file loading functions 
 * Handles SOAP, .xml, Document objects and any accessible HTTP file
 *
 */
  {
    this.XMLHTTP = function() {;}
    
    this.HTTP = function(method,file,callback,SOAP)
	  {
	    this.HTTP = function(aOb)
	      { 
		    try
		      {
	            var method = aOb[0];
	            var file = aOb[1];
	            var callback = aOb[2];
	            var SOAP = aOb[3] || null;

		        var ob = new System.XMLHTTP._handler();
			
			    ob.httpHandle.open(method,file,true);
                ob.httpHandle.send(SOAP || null);
							
			    this.ref = ob.httpHandle;
			    this.callback = callback;
              }
		    catch(e)
	          {
	            System.handleException(e,arguments);
		      }
		  }
		  
        this.main = function()
          {
            if(this.ref.readyState == 4)
			  {
			    // need to load the received data into a document
			    // object.  Get the text, and translate any special chars  
                var ser = this.ref.responseText;	  
                // < > get translated to special chars; need to translate back  
                ser = ser.replace(/&lt;/g,'<');
                ser = ser.replace(/&gt;/g,'>');
                
                // create the return object
			    var retOb = new Object();
			    // store string version
			    retOb.serialized = ser;
			      
                // create the document object and pack it
			    retOb.document = System.XMLHTTP.DocumentObject();        
	            retOb.document.loadXML(retOb.serialized);	
			      
                this.callback(retOb);
			    return(false);
			  }
			else
			  {
			    return(true);
			  }
		  }
	  }

	this.XML = function()
	  {
	    this.XML = function(aOb)
	      {
	        try
	          {
	            var file = aOb[0];
    	        var callback = aOb[1];
	            var ob = new System.XMLHTTP._handler();
		        try // moz
	              { 
                    ob.xmlHandle.open("GET",file,true);
                    ob.xmlHandle.send(null);
		          }
			    catch(e)
			      {
	                ob.xmlHandle.async = false;
                    ob.xmlHandle.load(file);
				  }
				   							
			    this.file = file;
			    this.ref = ob.xmlHandle;
				this.callback = callback;
			  }
		    catch(e)
		      {
		        System.handleException(e,arguments);
		      }
		  }
		 									
		this.main = function()
		  {
 		    if(this.ref.readyState == 4)
			  {
			    var result = (System.D_isMoz()) 
			               ? this.ref.responseXML 
			               : this.ref.documentElement;
                this.callback(result);
			    return(false);
			  }
			else
			  {
			    return(true);
			  }	 
		  }	
	  }
		    
	this.DocumentObject = function(uri,root)
	  {
	    nsURI = uri || "";
	    rootTag = root || "";
	      
	    var dOb = 
	      {
	        document: null,
	        loadXML: function(xml)
	          {
	            // note quite different methods used for 
	            // the different browsers
	            try // moz
	              {
	                // build xml string
	                var dP = new DOMParser();
                    var xmlStr = dP.parseFromString(xml,'text/xml');

                    // clear document
                    while(this.document.hasChildNodes())
                      {
                        this.document.removeChild(this.document.lastChild);
                      }
                          
                    // add xml to document
                    for(i=0; i< xmlStr.childNodes.length; i++) 
                      {
                        this.document.appendChild(this.document.importNode(xmlStr.childNodes[i],true));
                      }
                  }
	            catch(e) 
	              {
	                try // ie?
	                  {
	                    this.document.loadXML(xml);
	                  }
	                catch(e) // problem
	                  {
	                    System.handleException(e,arguments);
	                  }
	              }
	          }
	      };
		        
	    // create DOM Document ref
	    try // moz
	      {
            dOb.document = document.implementation.createDocument(nsURI,rootTag,null);
          }
	    catch(e)
	      {
	        // IE reuses xmlHandle
            dOb.document = new System.XMLHTTP._handler().xmlHandle;
            dOb.document.loadXML("&lt;a0:" + rootTag + "xmlns:a0=\"" + nsURI + "\" /&gt;");
	      }
		return(dOb);
	  }
		
    this.serialize = function(obj)
      {
        try // moz
	      {
	        var s = new XMLSerializer();
	        var ser = s.serializeToString(obj);
	      }
	    catch(e)
	      {
	        var ser = obj.xml;
	      }	
	    return(ser);
      }
	        
	this._handler = function()
	  {
        try // moz
	      {
	        this.httpHandle = new XMLHttpRequest();
	        this.xmlHandle = new XMLHttpRequest(); 
	      }
	    catch(e)
	      {
            try 
		      {
                this.httpHandle = new ActiveXObject("Microsoft.XmlHttp");
                this.xmlHandle = new ActiveXObject("MSXML.DOMDocument");
			  }
            catch(e) {;}
          }
      }
  }

