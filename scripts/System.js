var System = 
  {
	register: function(scr)
	  {
	    try
		  {
	        // set prototype of new object to System
			eval(scr + ".prototype = System");
								
           	// add new object to System collection
			eval("this." + scr + " = new " + scr);
			
			// try to call constructor, if any
			try
			  {
			    eval("this." + scr + "." + scr + "()");
			  } catch(e) {;}
		  }
		catch(e)
		  {
		    this.handleException(e,arguments);
		  }
	  },
	
	build: function()
	  {
        var args = new Array();
		for(a=0; a < arguments.length; a++)
		  {
	        args[a] = arguments[a];
		  }	  
	  
        // establish name of constructor
        var constr = args[0];

		// now lose constructor name, preserving remaining arguments
		args.shift();
			
		// We want every constructed object to have its collection
		// accessible as a prototype. Establish connection.
		var resolvedConstr = eval("this." + constr);
		resolvedConstr.prototype = this;
			           
        // instantiate
		var inst = new resolvedConstr;
			
		// call the constructor function, passing it remaining arg list
		eval("inst." + constr + "(args)");

        // remove INSTANCE constructor function to minimize memory use
        eval("inst." + constr + " = function(){;}");

		// return the constructed object
		return(inst);	  
	  },
	
	
	
	
	/**************************************
	 *  QUEUE  ****************************
	 **************************************/
	 
	 
	 
	Queue:
	  {			
	    queueTimer: null,
		
	    queue: new Array(),
		
		add: function(ob)
	      {
		    var sOb = ob || new Object();
		    sOb.main = sOb.main || function() { return(false); }
			
		    this.queue.push(sOb);
		    return(sOb);
	      },
	
	    walk: function()
          {	 
		    var instance = false;
				
		    // because the queue will probably be appended to during this routine, the 
		    // terminal instruction of the start set is needed to terminate the run
		    var terminal = this.queue[this.queue.length-1];
				
		    while(instance = this.queue.shift())
		      {
		        try
		          {
			        // execute main routine of object and
                    // reintroduce to queue if main() returns true
      		        instance.main() && this.queue.push(instance);
		          }
			    catch(e)
			      {
			        // note that if an error occurs in instance.main() the instance
				    // is removed from the queue by force: ie. it will never get pushed
			        System.handleException(e,arguments);
			      }
			    // die if we've reached the end of the ORIGINAL queue
			    if(instance == terminal) 
			      { 
			        break; 
			      }
			  }
		  },
		  
		kill: function(ref)
		  {
	        for(q=0; q<this.queue.length; q++)
			  {
			    if(this.queue[q] == ref)
				  {		  
			        this.queue.splice(q,1);
					return(true);
				  }
			  }
			return(false);
		  },
		  
	    start: function()
	      {
	        this.queueTimer = setInterval('System.Queue.walk()',1);
		    System.D_resetMMoveHandler();
	      },
		  
		stop: function()
		  {
		    clearInterval(this.queueTimer);
		  },
		  
		executeFailsafe: function(r) 
		  {
		    // get object ref
		    var ref = eval('System.Queue.' + r);
			
			// first call the handler; if handler returns true,
			// kill the object; if false, don't.
			if(ref.kill())
			  {		
			    // kill the object
		        try
			      {
			        System.Queue.kill(ref.ref);
			      }
			    catch(e) {;}
              }
			  
			// regardless, destroy failsafe object
			eval('delete(System.Queue.' + r + ')');
		  },  
		  
		setFailsafe: function(ref,time,kill)
		  {
		    try
			  {
		        var tm = time || 30000; // default 30 seconds
			
		        var randK = 'failsafe' + Math.round(Math.random(1)*10000000000000000000);
			    var nOb = eval('System.Queue.' + randK + ' = new Object()');
			
			    nOb.ref = ref; // store queue reference
			    nOb.kill = kill || function() { return true; }
			
			    setTimeout('System.Queue.executeFailsafe("' + randK + '")', tm);
			  }
			catch(e) { System.handleException(e,arguments); }
		  }
	  },
	  

	/*********************************
	 * EVENTS ************************
	 *********************************/
	 
	 
	Events:
	  {
	    /* 
		 * stores all events and related information, ie.
		 * System.Events.library.EG8H32OHl833XMQX.[properties]
		 * System.Events.library.****eventId*****.***object***
		 * 
		 * populated by System.Events.register
		 */
	    library: new Object,
		
		/* stores keyboard shortcuts for events.  
		 * key = 1:1:1:27
		 *       ^ alt key
		 *         ^ ctrl key
		 *           ^ shift
		 *             ^ keycode
		 *
		 * value = function which calls System.Events._raise(evId);
		 *
		 */
        shortcuts: new Array(),
		
		// populates System.Events.shortcuts array
		setShortcut: function(sstr, evId)
		  {
		    if(sstr)
			  {
			    this.shortcuts[sstr] = eval('function() { System.Events._raise("' + evId + '"); }');
			  }
		  },
		
		// the handler for all events
		_raise: function(evId)
		  {
		    try
			  {
			    var evOb = eval('this.library.' + evId);
				
			    // make sure dependencies exist
				if(evOb.checkDependencies())
				  {
					System.Queue.add(evOb.main);
				  }
			  } 
			catch(e) { System.handleException(e,arguments); }
		  },
		
		// registers the event, handler, dependencies, shortcuts, etc.
	    register: function(code, evId, evType, evTarg, evDepend, evShortcut)
		  {
		    try
			  {
			    // create an object in the library
				// NOTE: overwrites any existing event with same id
			    var evOb = eval('this.library.' + evId + ' = new Object()');
				
				// keep original information
			    evOb.id = evId;
				evOb.type = evType;
				evOb.target = targ;
				evOb.shortcut = evShortcut || '';
				
				// the code that actually executes
				evOb.main = eval(code);
				
				// dependency functions
				evOb.dependents = new Array();
				evOb.setDependency = this._setDependency;
				evOb.checkDependencies = this._checkDependencies;
				
				// set any sent depencies
				for(c=0; c<evDepend.length; c++)
				  {
				    evOb.setDependency(evDepend[c]);
				  }
				
				// set any sent shortcut
				setShortcut(evOb.shortcut, evOb.id);
			  } 
			catch(e) { System.handleException(e,arguments); }
		  },
		  
		_setDependency: function(depId)
		  {
		    // add to dependents list
			try
			  {
				this.dependents[depId] = eval('function() { return(document.getElementById("' + targId + '")); }');
			  } 
		    catch(e) { System.handleException(e,arguments); }  
		  },
		
		_checkDependencies: function()
		  {
		    try
			  {
				for(d=0; d<this.dependents.length; d++)
				  {
				    if(this.dependents[d]()) { continue; }
					return(false);
				  }
				return(true);
			  } 
			catch(e) { System.handleException(e,arguments); }
		  }
	  },
	 
	  
	  
	/************************************
	 *  DOCUMENT INFO  ******************
	 ************************************/  
	 
	 
	 
	  
    D_eventInfo:
	  {
	    element: new Object(),
	    
	    xPos: null,
	    yPos: null,
	    
	    currentFrame: null,

		// written to by Keyboard object, if any, onkeypress
        lastKey: null,
	    lastModKey: null
      },
	
	D_monitor: function(e)
	  {
	    var ns = (e);
		var ev = (ns) ? e : window.event;
	    // note that this function executes in the event scope, so
		// we need to build a direct ref to System
		var eInf = System.D_eventInfo;
		eInf.element = (ns) ? ev.target : ev.srcElement;
		eInf.xPos = (ns) ? ev.pageX : ev.clientX + document.body.scrollLeft;
		eInf.yPos = (ns) ? ev.pageY : ev.clientY + document.body.scrollTop;
	
		System.D_addedMMoveHandler();
      },	
      
	D_isMoz: function() 
	  { 
	    return(window.XMLHttpRequest); 
	  },

	D_cursorX: function()
	  {
	    return(top.System.D_eventInfo.xPos);
	  },
						
 	D_cursorY: function()
	  {
	    return(top.System.D_eventInfo.yPos);
	  },
			
	D_currentElement: function()
	  {
	    return(top.System.D_eventInfo.element);
	  },
		  
	D_screenWidth: function()
	  {
	    return(window.screen.width);
	  },
		  
	D_screenHeight: function()
	  {
	    return(window.screen.height);
	  },
	  
	D_clientWidth: function()
	  {
	    return(this.D_isMoz()) ? window.innerWidth : document.body.clientWidth; 
	  },
	  
	D_clientHeight: function()
	  {
	    return(this.D_isMoz()) ? window.innerHeight : document.body.clientHeight; 
	  },
	  
	D_scrollTop: function()
	  {
	    return(this.D_isMoz()) ? window.scrollY : document.body.scrollTop;
	  },
	  
	D_scrollLeft: function()
	  {
	    return(this.D_isMoz()) ? window.scrollX : document.body.scrollLeft;
	  },
	  
	D_disableSelect: function()
	  {
	    if(System.D_isMoz())
		  {
			System.oldMDN = document.onmousedown;
	        document.onmousedown = function() 
			  {
			    document.onmousedown = eval(System.oldMDN); 
			    return false; 
			  }
		  }
		else
		  {
		    document.onselectstart = function() { return false; }
			document.onclick = function() { document.onselectstart = function() { return true; } }
		  }
	  },
	
	D_addedMMoveHandler: function() {;},
	  
	D_addMMoveHandler: function(fun)
	  {
	    try
		  {
	        this.D_addedMMoveHandler = fun;
		  }
		catch(e) {;}
	  },
	
	D_resetMMoveHandler: function()
	  {
	    document.onmousemove = System.D_monitor;
  
		this.D_addedMMoveHandler = function() {;}
	  },
	  
	handleException: function(er,ar)
	  {
	  	var err = '>> ' + er + '\n';
		try
		  {
	        for(p in er)
		      {
	            err += '>> ' + p + ': ' + eval('er.'+p) + '\n';
		      }
		  }
		catch(e) {;}
	    alert(err);
	  }
  };
  
