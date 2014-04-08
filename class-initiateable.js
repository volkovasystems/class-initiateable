try{ var base = window; }catch( error ){ var base = exports; }
( function module( base ){
	define( "Initiateable",
		[
			"hardenProperty",
			"hardenAllProperty",
			"argumentsToArray",
			"prompt",
			"arrayContains"
		],
		function construct( ){
			var Initiateable = function Initiateable( ){
				var parameters = argumentsToArray( arguments );
				this.executeInitiators.apply( this, parameters );
			};

			hardenAllProperty( Initiateable, {
				"GLOBAL_SCOPE": "global",
				"CLASS_SCOPE": "class",
				"ANCESTRY_SCOPE": "ancestry",
				"LOCAL_SCOPE": "local",
			} );

			Initiateable.prototype.executeInitiators = function executeInitiators( ){
				var parameters = argumentsToArray( arguments );

				var initiatorList = Initiateable.initiatorList;

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

					The order of the parameters will be:
						initiator, namespace, scopeType
				@end-method-documentation
			*/
			Initiateable.prototype.registerInitiator = function addInitiator( ){
				var parameters = argumentsToArray( arguments );

				var namespace;
				var initiator;
				var scopeType;
				/*
					If the first parameter is a namespace,
						then it should already be existing in the initiator list.

					The namespace may contain a scope but if
						there is no scope given then assumed the next parameter
						is a scope.

					The scope may be tied to the namespace or be given as a second
						parameter. 
				*/
				if( typeof parameters[ 0 ] == "string" ){
					namespace = parameters[ 0 ];
				}else{
					initiator = parameters[ 0 ];
				}
				
				//The scopeType is given as the second parameter.
				if( !scopeType
					&& ( parameters[ 1 ] === Initiateable.GLOBAL_SCOPE
						|| parameters[ 1 ] === Initiateable.CLASS_SCOPE
						|| parameters[ 1 ] === Initiateable.ANCESTRY_SCOPE
						|| parameters[ 1 ] === Initiateable.LOCAL_SCOPE ) )
				{
					scopeType = parameters[ 1 ];
				}

				//The namespace is given as the second parameter.
				if( !namespace
					&& !scopeType
					&& typeof parameters[ 1 ] == "string"
					&& parameters.length >= 2 )
				{
					namespace = parameters[ 1 ];
				}

				//The scopeType is given as the last parameter.
				if( !scopeType 
					&& parameters.length == 3 )
				{
					scopeType = parameters[ 2 ];
				}

				//Try checking the scopeType in the namespace.
				var pattern = ( /\:/ );
				if( namespace && !scopeType ){	
					if( pattern.test( namespace ) ){
						scopeType = namespace.split( pattern )[ 0 ];
					}
				}

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

				//Prepend only if it is not yet been prepend.
				if( !pattern.test( namespace ) ){
					//Prepend the scope to complete the namespace.
					namespace = scopeType + ":" + namespace;	
				}

				/*
					To solve initiator pollution keep track of the namespaces
						through an initiatorRegistry.
				*/
				if( "initiatorRegistry" in this ){
					hardenProperty( this, initiatorRegistry, [ ] );
				}

				if( arrayContains( this.initiatorRegistry, namespace )
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
				this.initiatorRegistry.push( namespace );

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