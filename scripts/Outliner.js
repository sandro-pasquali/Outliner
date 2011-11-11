
function Outliner()
  {
    this.Outliner = function()
	  {
        this.columnAList 			= new Object();
        this.container 				= '';
	    this.itemCount 				= -1;
	    this.separatorCount 		= 1;
	    this.curListOb 				= null;
		this.selectedItemOffset 	= 0;
		this.selectedItem			= null;
		this.startSeparator			= null;
		this.curSeparator			= null;
		this.curItemSelected		= null;
		this.curItemEditor 			= null;
		this.curItemEditorParent 	= null;
	  };
	  
	this.run = function()
	  {
	    this.getView();
		
		System.Keyboard.defineKey(27,this.clearEditor);
		System.Keyboard.defineKey(192,this.showInfo);
	    System.Keyboard.start();
	  };
	  
	this.getView = function()
	  {
        System.D_addMMoveHandler(this.moveItem);
		this.makeContainer();
		
		this.curListOb = new Object();
				  
		this.curListOb.className = 'baseItem';
		this.curListOb.elType = 'ITEM';
		this.curListOb.elID = 'sandro'; // the id of the item	
		this.curListOb.elText = 'hithere';
		
		this.makeSeparator();
        this.makeItem();		
					
		this.curListOb = new Object();
				  
		this.curListOb.className = 'baseItem';
		this.curListOb.elType = 'ITEM';
		this.curListOb.elID = 'sandro2'; // the id of the item
		this.curListOb.elText = 'dfdf';
		this.makeSeparator();
        this.makeItem();	
					
		this.curListOb = new Object();
				  
		this.curListOb.className = 'baseItem';
		this.curListOb.elType = 'ITEM';
		this.curListOb.elID = 'sandro3'; // the id of the item
		this.curListOb.elText = 'dfd';
		this.makeSeparator();
        this.makeItem();	
	
		this.curListOb = new Object();
				  
		this.curListOb.className = 'baseItem';
		this.curListOb.elType = 'ITEM';
		this.curListOb.elID = 'sandro4'; // the id of the item
		this.curListOb.elText = 'dfdsdfsafsafas';
		this.makeSeparator();
        this.makeItem();		
		
		this.curListOb = new Object();
				  
		this.curListOb.className = 'baseItem';
		this.curListOb.elType = 'ITEM';
		this.curListOb.elID = 'sandro5'; // the id of the item
		this.curListOb.elText = 'dfdsd  fsafs  afas';
		this.makeSeparator();
        this.makeItem();					
					
		document.body.appendChild(this.container);
	  };
	  
    this.makeContainer = function()
	  {
		// holds the list
	    this.container = document.createElement('div'); 
		this.container.id = 'columnContainer';
		
		this.container.style.position = 'absolute';
		this.container.style.top = '30px';
		this.container.style.left = '260px';
		this.container.style.width = '240px';
	  };

	this.makeSeparator = function()
	  {
		// make separator
	    var sep = document.createElement('img');
	    sep.id = 'separator' + this.separatorCount;

		sep.className = 'itemSeparator';
		sep.src = 'images/dummy.gif';
		sep.itemAfter = (this.itemCount += 2);
				
		sep.onmouseup = function() 
	      {
			System.Outliner.deactivateSeparator(this); 
			System.Outliner.dropItem(this.itemAfter); 
		  };
				
		sep.onmouseover = function() { System.Outliner.activateSeparator(this); };
		sep.onmouseout = function() { System.Outliner.deactivateSeparator(this); };

		sep.ondrag = function()// ie specific event cancel
		  {
			try 
		      {
				if(System.Outliner.selectedItem)
			      {
		            window.event.cancelBubble = true;
		            window.event.returnValue = false;
				  }
		      } catch(e) {;}
		  };
			
		// attach separator to container;
		this.container.appendChild(sep); 
		this.separatorCount++;
      };

    this.makeItem = function()
	  {
		var nOb = this.curListOb; // copy, since we need a unique object;
				
		// insert object into list
		var obInd = this.columnAList.add(nOb);
					
        // now build document Item from nOb;
		var nEl = document.createElement('div');
					
        nEl.className = this.curListOb.className;
        nEl.elType = this.curListOb.elType;
		nEl.elID = this.curListOb.elID;
		nEl.obRef = obInd-1;
					
		var hnd = document.createElement('div');
		hnd.className = 'handle';
		  
		var hndIc = document.createElement('div');
        hndIc.className = 'fileIcon';
		hnd.appendChild(hndIc);
		  
		var hndTxt = document.createTextNode(obInd);
		hnd.appendChild(hndTxt);
		  
		nEl.appendChild(hnd);
		  
		var elT = document.createElement('div');
		elT.className = 'handleText';
		  
		var elTxt = document.createTextNode(this.curListOb.elText);	  
		elT.appendChild(elTxt);
		nEl.appendChild(elT);
		  
		this.bindItemHandlers(nEl);
		  
		this.container.appendChild(nEl);
      };
	  
    this.assignItemAttributes = function(frm,to)
	  {
		var ob = this.columnAList.get(frm.obRef);
	    to.className = ob.className;
        to.elType = ob.elType;
		to.elID = ob.elID;
		to.obRef = frm.obRef;
		to.elText = frm.elText;
	  };
	  
    this.bindItemHandlers = function(el)
	  {
		el.onmousedown = function() { System.Outliner.selectItemText(this); };
		el.ondblclick = function() { System.Outliner.editItemText(this); };
		el.firstChild.onmousedown = function() { System.Outliner.liftItem(this.parentNode.previousSibling); };
	  };
	  
    this.selectItemText = function(t)
	  {
	    if(System.Outliner.curItemEditor)
		  {
		    // if mousedown on editor proper, do nothing
	        if(t == System.Outliner.curItemEditorParent) { return; } 
			
			this.clearEditor();
		  }
	
	    this.deselectItemText(); // clear last
		
	    System.Outliner.curItemSelected = t;
		System.Outliner.curItemSelected.className = 'selectedItem';
	  };
	  
	this.deselectItemText = function()
	  {
	    if(System.Outliner.curItemSelected)
		  {
		    System.Outliner.curItemSelected.className = 'baseItem';
		  }
	  };
	  
	this.clearEditor = function()
	  {
	    if(System.Outliner.curItemEditor)
		  {
		    var nT = document.createElement('div');
		    nT.className = 'handleText';
		  
		    var nTxt = document.createTextNode(System.Outliner.curItemEditor.value);	  
		    nT.appendChild(nTxt);
		  
			// update itemList value
			System.Outliner.columnAList.get(System.Outliner.curItemEditorParent.obRef).elText = System.Outliner.curItemEditor.value;
			
			
			// lose edit box
		    System.Outliner.curItemEditorParent.removeChild(System.Outliner.curItemEditorParent.lastChild);
			
			// add new text
		    System.Outliner.curItemEditorParent.appendChild(nT);
		    System.Outliner.curItemEditor = null;
			
			System.Outliner.selectItemText(System.Outliner.curItemEditorParent);
			
		    System.Outliner.curItemEditorParent = null;
		  }
	  };
	  
    this.editItemText = function(t)
	  {
	    this.clearEditor();
	    this.deselectItemText();
		  
	    var dE = document.createElement('textarea');
		dE.className = 'itemEditBox';
		
		dE.ondblclick = this.clearEditor;
		dE.value = t.childNodes.item(1).firstChild.nodeValue;
		
		// guesstimate height necessary based on container width
		// and number of characters in box.  Note audacity of kludge.
		var rows = Math.max(3,Math.ceil(dE.value.length/(parseInt(document.getElementById('columnContainer').style.width)/12)));
        dE.style.height = rows*17;
		
		// very ugly, but strange behaviour from IE
		if(!System.D_isMoz())
		  { 
		    dE.style.width = '86%';
		  }
		
		this.curItemEditor = dE;
		System.Outliner.curItemEditorParent = t;
		
		// lose existing text element
		t.removeChild(t.lastChild);
		
		// replace with text editor
        t.appendChild(dE);
		
		dE.focus();
		
		// more IE ugly
		if(!System.D_isMoz())
		  {
		    dE.value += '';
		  }
	  };
	  
    this.moveItem = function()
	  {
	    if(System.Outliner.selectedItem)
		  {
		    System.Outliner.selectedItem.style.top = System.D_cursorY() + 6;
			System.Outliner.selectedItem.style.left = System.D_cursorX() - System.Outliner.selectedItemOffset;
			System.Outliner.selectedItem.style.visibility = 'visible';
		  }
	  };
	 
    this.removeGhost = function()
	  {
	    if(System.Outliner.selectedItem)
		  {
		    // get rid of ghost &c
	        var nde = document.getElementById('itemGhost');
	        if(System.D_isMoz())
		      {
		        nde.parentNode.removeChild(nde);
		      }
		    else
		      {
		        nde.removeNode(true);
		      }
		    System.Outliner.selectedItem = null;
		    System.Outliner.selectedItemOffset = 0;
	      }
	  };
	  
    this.dropItem = function(itAft)
	  {
	    if(System.Outliner.selectedItem)
		  {
		    // get rid of ghost &c
	        System.Outliner.removeGhost();
			 			
	        // since mozilla sends events as arguments automatically, itAft will be an event object instead
		    // of a number whien dropItem is called on a mouseup from document.mouseup.  so deal with this.
		    if(itAft && (typeof(itAft) == 'object')) { return; }
			
			if(itAft && (System.Outliner.startSeparator.itemAfter != itAft)) // if not the same node...
			  {

			    // now move dragged node to new position  
		        var containNode = document.getElementById('columnContainer');
				var cNodes = containNode.childNodes;
				
				var start = System.Outliner.startSeparator.itemAfter;
				var end = itAft;
				var dir = (start < end ) ? 2 : -2;
				if(dir > 0) { end -= 2; }
				
				var origNode = cNodes.item(start).cloneNode(true);
				this.assignItemAttributes(cNodes.item(start),origNode);
				this.bindItemHandlers(origNode);
				
				while(start != end)
				  {
				    var nextNode = cNodes.item(start + dir).cloneNode(true);	
				    this.assignItemAttributes(cNodes.item(start + dir),nextNode);	
					this.bindItemHandlers(nextNode);
						
					var newNode = containNode.replaceChild(nextNode, cNodes.item(start));
					start += dir;
				  }
				  
				// now return original node in new place
				containNode.replaceChild(origNode, cNodes.item(end));
				
				this.selectItemText(origNode);
				
				var dd = document.getElementById('attDisplay');
			  }
		  }
	  };
	
    this.liftItem = function(t)
	  {
	    this.clearEditor();
	    System.Outliner.startSeparator = t;
		
	    document.getElementById('dumbTarget').focus();
	    System.D_disableSelect();
		this.deselectItemText();
		
	    if(System.Outliner.selectedItem) { System.Outliner.dropItem(); }

		var it = document.getElementById('columnContainer').childNodes.item(System.Outliner.startSeparator.itemAfter);		
		
		
		System.Outliner.selectedItemOffset = System.D_cursorX() - parseInt(document.getElementById('columnContainer').style.left);

		var itemGhost = document.createElement('DIV');
		itemGhost.className = 'baseItem';
		itemGhost.id = 'itemGhost';
		itemGhost.style.border = '1px black dashed';
		itemGhost.style.position = 'absolute';
		itemGhost.style.width = parseInt(document.getElementById('columnContainer').style.width);
		itemGhost.style.visibility = 'hidden';

		// make clone of item
		
		var itCont = document.createElement('div');
		itCont = it.cloneNode(true);
		itemGhost.appendChild(itCont);
		itemGhost.style.zIndex = 2000;
		
		System.Outliner.selectedItem = document.body.appendChild(itemGhost)
	  };
	  
    this.activateSeparator = function(t)
	  {  
	    if(System.Outliner.selectedItem && (t != System.Outliner.startSeparator))
		  {
		    t.style.backgroundImage = 'url(images/separator.gif)';
		  }
		System.Outliner.curSeparator = t;
	  };
	  
    this.deactivateSeparator = function(t)
	  {
	    if(System.Outliner.selectedItem)
		  {
			t.style.backgroundImage = '';
		  }
		System.Outliner.curSeparator = null;
	  };
	  
    this.showInfo = function()
	  {
	    var itm;
		try
		  {
	        itm = System.Outliner.curItemSelected || System.Outliner.curItemEditorParent;
		  } catch(e) {;}
		  
		if(itm)
		  {
		    alert(System.Outliner.columnAList.get(itm.obRef).elText);
		  
		  }
	  };  
  };
