
function LinkedList()
  {
	this.LinkedList = function() {;};
	
	this.List = function()
	  {  
	    this.List = function()
	      {
	        this.collection = new Array();
	        // if a collection(array) is sent, attach to the list 
	        if(arguments[0]) 
	          { 
	            this.addAll(arguments[0]); 
	          }
	      };

        //------------------------------------------------------------------------------ getFirst()
		
	    this.getFirst = function()
	    /*
	     * Returns the first item in the list.  If this list is empty,
	     * returns an empty object.
	     */
		  {
		    if(this.size())
	          {
			    return(this.collection[0]);
			  }
		    else
			  {
			    return(new Object());
			  }
	      };

		//------------------------------------------------------------------------------ getLast()			
			
		this.getLast = function()
		/*
	     * Returns the last item in the list.  If this list is empty,
	     * returns an empty object.
	     */
	      {
	        if(this.size())
		      {
	            return(this.collection[this.size()-1]);
	          }
		    else
		      {
		        return(new Object());
		      }
	      };
			
	    //------------------------------------------------------------------------------ removeFirst()			
			
	    this.removeFirst = function()
	    /*
	     * Removes and returns the FIRST element from this list. Returns
	     * empty object if this list is empty.
	     */
	      {
	        if(this.size())
		      {
			    return(this.collection.shift());
	          }
		    return(new Object());
	      };
			
        //------------------------------------------------------------------------------ removeLast()
			
	    this.removeLast = function()
	    /*
	     * Removes and returns the LAST element from this list.  Returns
	     * empty object if this list is empty.
	     */
	      {
	        if(this.size())
		      {
		        return(this.collection.pop());
		      }
		    return(new Object());
	      };
		
	    //------------------------------------------------------------------------------ addFirst()		
			
	    this.addFirst = function(element)
	    /*
	     * Inserts given element to the beginning of this list 
	     */
	      {
		    this.collection.unshift(item);
		    return(false);
	      };
			
	    //------------------------------------------------------------------------------ addLast()			
		
	    this.addLast = function(element)
	    /*
	     * Appends given element onto the end of this list 
	     * (identical in function to the add method; included
	     * only for consistency)
	     */
	      {
		    this.collection.push(item);
		    return(false);
	      };
			
	    //------------------------------------------------------------------------------ contains()			
			
	    this.contains = function(element)
	    /*
	     * Returns true if this list contains at least one object == element
	     */
	      {
	        for(c=0; c<this.size(); c++)
	          {
		        if(this.collection[c] == element)
	    	      {
			        return(true);
			      }
		      }
		    return(false);
	      };
			
	    //------------------------------------------------------------------------------ size()			
		 
	    this.size = function()
	    /*
	     * returns the number of elements in this list. Note that zero(0)
	     * will be understood as boolean false by javascript
	     */	
	      {
	        return(this.collection.length);
	      };
		
	    //------------------------------------------------------------------------------- swapOnIndex()
		
		this.swapOnIndex = function(a,b)
		/*
		 * swaps elements at indices a,b
		 */
		  {
		    var aOb = this.get(a);
			var bOb = this.get(b);
			
			this.collection[a] = bOb;
			this.collection[b] = aOb;
		  };
		  
		//------------------------------------------------------------------------------- swapOnElement()
		
		this.swapOnElement = function(a,b)
		  {
		    var aI = this.indexOf(a);
			var bI = this.indexOf(b);
			
			this.collection[aI] = b;
			this.collection[bI] = a;
		  };
		  
	    //------------------------------------------------------------------------------- add()			
			
	    this.add = function()
	    /*
	     * Depending on the number of arguments sent, different operations occur:
	     *
	     * add(object)
	     * Appends given element onto the end of this list 
	     *
	     * add(index,object)
	     * Inserts element at given index in this list
	     *
	     * NOTE: no checking is done of arguments, other than length.
	     * Passing wrong argument types will creates errors.
	     *
	     * NOTE: attempting to add to an empty list by passing two arguments
	     * (zero(0) index, object) will fail: use simple form (object) only.
	     */
	      {
	        if(arguments.length==1) // appending
		      {
		        return(this.collection.push(arguments[0]));
		      }
		    else if(this.boundsCheck(arguments[0])) // index within bounds?
		      {
		        this.collection.splice(arguments[0],0,arguments[1]);
			    return(true);
		      }
		    return(false);
	      };
			
	    //------------------------------------------------------------------------------ remove()		
			
	    this.remove = function(arg)
	    /*
	     * Depending on the type of argument sent, different results occur.
	     *
	     * remove(object)
	     * Removes the first occurrence of the specified element in this list.
	     * If the list does not contain the element, it remains unchanged. 
	     *
	     * remove(number)
	     * Removes the element at the given index
	     *
	     * remove(string)
	     * Will attempt to convert string to an number, then 
	     * use the number as above; if this fails, returns false
	     */
	      {
	        if(typeof(arg)=='object')
		      {
		        for(c=0; c<this.size(); c++)
		          {
	                if(this.collection[c] == arg)
			          {
		                this.collection.splice(c,1);
				        return(true);
			          }
			      }
		      }
				
		    // try to convert if string
		    if(typeof(arg)=='string')
		      {
		        arg = 0 + arg; 
		      }

		    if(typeof(arg)=='number')
		      {
		        if(this.boundsCheck(arg))
		          {
			        this.collection.splice(arg,1);
				    return(true);
			      }
		      }
		    // out of range or invalid argument
		    return(false);
	      };
			
	    //------------------------------------------------------------------------------ addAll()			
			
	    this.addAll = function()
	    /*
	     * Depending on the number of arguments:
	     * addAll(Array)
	     * Appends all of the elements in the specified collection to the end of this list.
	     *
	     * addAll(integer,Object)
	     * Inserts all of the elements in the specified collection this list at the
	     * point indicated by integer.
	     */
	      {
	        var a1 = arguments[0];
	        if(typeof(a1)=='array') // appending
		      {
	            for(x=0;x<a1.length;x++)
			      {
		            this.add(a1[x]);
			      }
		      }
		    else if(typeof(a1)=='number')
		      {
			    var a2 = arguments[1];
		        for(x=a1;x<a2.length;x++)
			      {
		            this.add(x,a2[x]);
			      }
		      }
	      };
			
	    //------------------------------------------------------------------------------ clear()			
			
	    this.clear = function()
	    /*
	     * Removes all elements from this list
	     */
	      {
	        this.collection = new Array();
		    return(false);
	      };
			
	    //------------------------------------------------------------------------------ get()			
			
	    this.get = function(ind)
	    /*
	     * Returns the element at the specified index 
	     */
	      {
	        if(this.boundsCheck(ind))
		      {
	            return(this.collection[ind]);
		      }
		    return(false);
	      };
			
	    //------------------------------------------------------------------------------ set()			
			
	    this.set = function(ind,obj)
	    /*
	     * Replaces element at specified index with specified object,
	     * returning replaced element, or empty object on error
	     */
	      {
	        if(this.boundsCheck(ind))
		      {
	            var prev = this.collection[ind];
		        this.collection[ind] = obj;
			    return(prev);
		      }
		    return(new Object());
	      };
			
	    //------------------------------------------------------------------------------ indexOf()			
			
	    this.indexOf = function(obj)
	    /*
	     * Returns the index in this list of the first occurrence of the specified
	     * element, or -1 if this list does not contain the element.
	     */
	      {
	        for(c=0;c<this.size();c++)
		      {
	            if(this.collection[c] == obj)
			      {
		            return(c);
			      }
		      }
		    return(-1);
	      };
			
	    //------------------------------------------------------------------------------ lastIndexOf()			
			
	    this.lastIndexOf = function(obj)
	    /*
	     * Returns the index in this list of the last occurrence of the specified
	     * element, or -1 if this list does not contain the element.
	     */
	      {
	        var last = -1;
	        for(c=0;c<this.size();c++)
		      {
		        if(this.collection[c] == obj)
			      {
		            last = c;
			      }
		      }
		    return(last);
	      };
			
	    //------------------------------------------------------------------------------ toArray()			
			
	    this.toArray = function()
	    /*
	     * returns an array containing all of the elements of this list
	     */
	      {
	        return(this.collection);
	      };
			
	    //------------------------------------------------------------------------------ listIterator()
			
	    this.listIterator = function(index)
	    /*
	     * Returns a ListIterator of the elements in this list (in proper sequence), 
	     * starting at the specified position in the list. 
	     */
	      {
	        return(new this.ListIterator(index,this.collection));
	      };

	    //------------------------------------------------------------------------------ boundsCheck()			
			
	    this.boundsCheck = function(ind)
	    /*
	     * Check if index within bounds
	     */
	      {
	        return((this.size())&&(ind>=0)&&(ind<this.size()));
	      };

/****************************************************************************************
 *                                                                                      *
 * LIST ITERATOR CONSTRUCTOR                                                            *
 * Returns an iterator object for the current linked list                               *
 * Instantiated with call to List.listIterator()                                        *
 *                                                                                      *
 ****************************************************************************************
 */ 
        this.ListIterator = function(index,coll)
          {
	        this.position = -1; // current seek position
	        this.collection = new Array(); // the list
	        // set to index of last successful call to next() or previous()
	        this.lastReturnedIndex = -1;

	        this.hasNext = function()
	        /*
	         * Returns true if this list iterator has more elements when 
	         * traversing the list in the forward direction
	         */
	          {
	            return((this.collection[this.position+1]) ? true : false);
	          };
			
	        this.next = function()
	          /*
	           * Returns the next element in the list, moving the pointer.
	           * If the end of the list has been reached, returns false;
	           */
	            {
	              if(this.hasNext())
	                { 
	                  this.lastReturnedIndex = ++this.position;
			        }
		          return(this.collection[this.lastReturnedIndex]);
		        };
			
	        this.hasPrevious = function()
	        /*
	         * Returns true if this list iterator has more elements when 
	         * traversing the list in the reverse direction
	         */
	          {
	            return((this.collection[this.position]) ? true : false);
	          };
		
	        this.previous = function()
	        /*
	         * Returns the previous element in the list, moving the pointer.
	         * If the beginning of the list has been reached, returns false;
	         */
	          {
	            if(this.hasPrevious())
	              {
	                this.lastReturnedIndex = this.position;
	                --this.position; 
		          }
		        return(this.collection[this.lastReturnedIndex]);
	          };
			
	        this.nextIndex = function()
            /*
	         * Retuns the index that would be returned by a subsequent call to next().
	         * Returns list size if the list iterator is at the end of the list
	         */
	          {
	            return((this.collection[this.position+1])? this.position+1 : this.collection.length);
	          };
			
	        this.previousIndex = function()
	        /*
	         * Retuns the index that would be returned by a subsequent call to previous().
	         * Returns -1 if the list iterator is at the beginning of the list
	         */
	          {
	            return((this.collection[this.position])? this.position : -1);
	          };
			
	        this.set = function(obj)
	        /*
	         * Replaces the last element returned by next() or previous() with
	         * the specified element.
	         */
	          {
	            if(this.lastIndex>-1)
	              {
	                this.collection[this.lastIndex] = obj;
	              }
	            else
	              {
	                return(false);
	              }
	          };
	      };
      };
  };