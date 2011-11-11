 
function Keyboard()
  {
    this.Keyboard = function()
	  {;}
			
    this.map = new Array();

    this.start = function()
      {
		try
		  {
            document.onkeydown = this.processEvent;
		  }
		catch(e)
		  {
		    System.handleException(e,arguments);
		  }
	  }
			
	this.stop = function()
	  {
	    try
		  {
	        document.onkeydown = function() {;}
		  }
		catch(e)
		  {
	        System.handleException(e,arguments);
		  }
	  }

	this.defineRange = function(start,finish,handler)
      {
        for(i=start; i<=finish; i++)
	      {
            try
			  {
	            this.map[i] = handler;
			  }
			catch(e)
			  {
			    System.handleException(e,arguments);
			  }
	      }
      }

    this.defineKey = function(code,handler)
      {
        try
		  {
		    this.map[code] = handler;
		  }
		catch(e) 
		  {
		    System.handleException(e,arguments);
		  }
      }
  
    this.processEvent = function(e) 
      {
        var ev = e || window.event;
        var kc = ev.keyCode;

		//alert(kc);
		
	    var mod = (ev.altKey) ? 1 : (ev.ctrlKey) ? 2 : (ev.shiftKey) ? 3 : null;
	
	    //System.Document.eventInfo.lastKey = kc;
		//System.Document.eventInfo.lastModKey = mod;
      
	    try
		  {
	        System.Keyboard.map[kc](mod,kc);
	      }
		catch(e) {;}
				
	    return true;
      }
  }
