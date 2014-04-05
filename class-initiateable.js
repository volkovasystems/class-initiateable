try{ var base = window; }catch( error ){ var base = exports; }
( function module( base ){
	define( "Initiateable",
		[
			"hardenProperty",
			"argumentsToArray",
			"prompt"
		],
		function construct( ){
			var Initiateable = function Initiateable( ){
				var parameters = argumentsToArray( arguments );
				this.executeInitiators.apply( this, parameters );
			};

			hardenProperty( Initiateable, {
				"GLOBAL_SCOPE": "global",
				"CLASS_SCOPE": "class",
				"ANCESTRY_SCOPE": "ancestry",
				"LOCAL_SCOPE": "local",
			} );

			Initiateable.prototype.executeInitiators = function executeInitiators( ){
				for( var index in this.initiatorList ){

				}
			};

			/*:
				@method-documentation:
					Register an initiator that will be called asynchronously
						after the constructor is called.

					Initiators are not part of the class structure,
						but may provide enhancements and extensions
						to the class structure.

					By registering an initiator you can modify during initialization
						of the object what the object can do.

					Initiators can be registered within a scope. This enabled
						the initiator to be manipulated and accessed depending
						on the scope.
				@end-method-documentation
			*/
			Initiateable.prototype.registerInitiator = function addInitiator( initiator, namespace, scopeType ){
				if( typeof initiator != "function" ){
					throw new Error( "invalid initiator function" );
				}

				if( namespace && typeof namespace != "string" ){
					throw new Error( "invalid initiator namespace" );
				}

				if( !initiator.name && !namespace ){
					throw new Error( "cannot determine initiator namespace" );
				}

				var initiatorList;
				if( scopeType === Initiateable.GLOBAL_SCOPE ){
					if( !( "initiatorList" in base ) ){
						hardenProperty( base, "initiatorList", { } );
					}
					initiatorList = base.initiatorList;
				}else if( scopeType === Initiateable.CLASS_SCOPE ){
					if( !( "initiatorList" in pseudoClass ) ){
						hardenProperty( Initiateable, "initiatorList", { } );
					}
					initiatorList = Initiateable.initiatorList;
				}else if( scopeType === Initiateable.ANCESTRY_SCOPE ){
					if( !( "initiatorList" in Initiateable.prototype ) ){
						hardenProperty( Initiateable.prototype, "initiatorList", { } );
					}
					initiatorList = Initiateable.prototype.initiatorList;
				}else if( !( "initiatorList" in this ) 
					|| scopeType === Initiateable.LOCAL_SCOPE )
				{
					/*
						This may polute the initiatorList from the ancestry scope.
					*/
					if( !( "initiatorList" in this ) ){
						hardenProperty( this, "initiatorList", { } );
					}
					initiatorList = this.initiatorList;
					scopeType = scopeType || Initiateable.LOCAL_SCOPE;
				}

				//The namespace here is just a partial namespace.
				namespace = initiator.name || namespace;

				//Prepend the scope to complete the namespace.
				namespace = scopeType + ":" + namespace;

				/*
					To solve initiator pollution keep track of the namespaces
						through an initiatorRegistry.
				*/
				if( "initiatorRegistry" in this ){
					hardenProperty( this, initiatorRegistry, { } );
				}

				if( namespace in this.initiatorRegistry
					|| namespace in initiatorList )
				{
					prompt( prompt.WARNING, "namespace is already present in the initiator registry" );
				}

				/*
					This object will use the initiators recorded in this registry
						plus the initiators recorded within global, class
						and ancestry scope.

					Note that, initiatorRegistry contains all initiators added to this
						object. 
				*/
				this.initiatorRegistry[ namespace ] = initiator;

				/*
					We will still record the initiators from this
						semi-private-public registry so that
						we can access them outside.
				*/
				initiatorList[ namespace ] = initiator;
			};

			Initiateable.prototype.removeInitiator = function removeInitiator( ){

			};			
		} );
} )( base );