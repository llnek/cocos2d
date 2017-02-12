(function(global) {
  var globalDefine = global.define;


/**
 * A lightweight inheritance API which is very similar to the
 * John Resig's Simple Inheritance API.
 *
 * Original author: Axel Rauschmayer
 * Original code: https://github.com/rauschma/class-js

* Code examples

// Superclass
var Person = Class.extend({
    constructor: function (name) {
        this.name = name;
    },
    describe: function() {
        return "Person called "+this.name;
    }
});

// Subclass
var Worker = Person.extend({
    constructor: function (name, title) {
        Worker.super.constructor.call(this, name);
        this.title = title;
    },
    describe: function () {
        return Worker.super.describe.call(this)+" ("+this.title+")"; // (*)
    }
});
var jane = new Worker("Jane", "CTO");
 */
define('brejep/class',[], function () {

    var Class = {

        extend: function (properties) {
            var superProto = this.prototype || Class;
            var proto = Object.create(superProto);
            // This method will be attached to many constructor functions
            // => must refer to "Class" via its global name (and not via "this")
            Class.copyOwnTo(properties, proto);

            var constr = proto.constructor;
            if (!(constr instanceof Function)) {
                throw new Error("You must define a method 'constructor'");
            }
            // Set up the constructor
            constr.prototype = proto;
            constr.super = superProto;
            constr.extend = this.extend; // inherit class method
            return constr;
        },

        copyOwnTo: function(source, target) {
            Object.getOwnPropertyNames(source).forEach(function(propName) {
                Object.defineProperty(target, propName,
                    Object.getOwnPropertyDescriptor(source, propName));
            });
            return target;
        }
    };

    return Class;
});

/**
 * Ash-js Family
 */
define('ash-core/family',[
    'brejep/class'
], function (Class) {


    var Family = Class.extend({
        nodes: null,

        constructor: function (nodeObject, engine) {
            this.__defineGetter__("nodeList", function() {
                return this.nodes;
            });
        },

        newEntity: function (entity) {
            throw new Error( 'should be overriden' );
        },

        removeEntity: function (entity) {
            throw new Error( 'should be overriden' );
        },

        componentAddedToEntity: function (entity, componentClass) {
            throw new Error( 'should be overriden' );
        },

        componentRemovedFromEntity: function (entity, componentClass) {
            throw new Error( 'should be overriden' );
        },

        cleanUp: function () {
            throw new Error( 'should be overriden' );
        }
    });

    return Family;
});

/**
 * Ash-js Node Pool
 */
define('ash-core/nodepool',[
    'brejep/class'
], function (Class) {


    var NodePool = Class.extend({
        tail: null,
        cacheTail: null,
        nodeClass: null,
		components : null,

        constructor: function (nodeClass, components) {
            this.nodeClass = nodeClass;
			this.components = components;
        },

        get: function() {
            if( this.tail ) {
                var node = this.tail;
                this.tail = this.tail.previous;
                node.previous = null;
                return node;
            } else {
                return new this.nodeClass();
            }
        },

        dispose: function( node ) {
			this.components.forEach(function(componentClass, componentName) {
				node[componentName] = null;
			});
			node.entity = null;
            node.next = null;
            node.previous = this.tail;
            this.tail = node;
        },

        cache: function( node ) {
            node.previous = this.cacheTail;
            this.cacheTail = node;
        },

        releaseCache: function() {
            while( this.cacheTail ) {
                var node = this.cacheTail;
                this.cacheTail = node.previous;
                this.dispose( node );
            }
        }
    });

    return NodePool;
});


/**
 * Ash-js Node List
 */
define('ash-core/nodelist',[
    'signals',
    'brejep/class'
], function (signals, Class) {


    var NodeList = Class.extend({
        constructor: function () {
            this.head = null;
            this.tail = null;
            this.nodeAdded = new signals.Signal();
            this.nodeRemoved = new signals.Signal();
        },

        add: function( node ) {
            if( !this.head ) {
                this.head = this.tail = node;
            } else {
                this.tail.next = node;
                node.previous = this.tail;
                this.tail = node;
            }
            this.nodeAdded.dispatch( node );
        },

        remove: function( node ) {
            if( this.head == node ) {
                this.head = this.head.next;
            }
            if( this.tail == node ) {
                this.tail = this.tail.previous;
            }
            if( node.previous ) {
                node.previous.next = node.next;
            }
            if( node.next ) {
                node.next.previous = node.previous;
            }
            this.nodeRemoved.dispatch( node );
        },

        removeAll: function() {
            while( this.head ) {
                var node = this.head;
                this.head = node.next;
                node.previous = null;
                node.next = null;
                this.nodeRemoved.dispatch( node );
            }
            this.tail = null;
        },

        empty: function() {
            return this.head === null;
        },

        swap: function( node1, node2 ) {
            if( node1.previous == node2 ) {
                node1.previous = node2.previous;
                node2.previous = node1;
                node2.next = node1.next;
                node1.next = node2;
            } else if( node2.previous == node1 ) {
                node2.previous = node1.previous;
                node1.previous = node2;
                node1.next = node2.next;
                node2.next = node1;
            } else {
                var temp = node1.previous;
                node1.previous = node2.previous;
                node2.previous = temp;
                temp = node1.next;
                node1.next = node2.next;
                node2.next = temp;
            }
            if( this.head == node1 ) {
                this.head = node2;
            } else if( this.head == node2 ) {
                this.head = node1;
            }
            if( this.tail == node1 ) {
                this.tail = node2;
            } else if( this.tail == node2 ) {
                this.tail = node1;
            }
            if( node1.previous ) {
                node1.previous.next = node1;
            }
            if( node2.previous ) {
                node2.previous.next = node2;
            }
            if( node1.next ) {
                node1.next.previous = node1;
            }
            if( node2.next ) {
                node2.next.previous = node2;
            }
        },

        insertionSort: function( sortFunction ) {
            if( this.head == this.tail ) {
                return;
            }
            var remains = this.head.next;
            for( var node = remains; node; node = remains ) {
                remains = node.next;
                for( var other = node.previous; other; other = other.previous ) {
                    if( sortFunction( node, other ) >= 0 ) {
                        if( node != other.next ) {
                            if( this.tail == node ) {
                                this.tail = node.previous;
                            }
                            node.previous.next = node.next;
                            if( node.next ) {
                                node.next.previous = node.previous;
                            }
                            node.next = other.next;
                            node.previous = other;
                            node.next.previous = node;
                            other.next = node;
                        }
                        break;
                    }
                }
                if( !other ) {
                    if( this.tail == node ) {
                        this.tail = node.previous;
                    }
                    node.previous.next = node.next;
                    if( node.next ) {
                        node.next.previous = node.previous;
                    }
                    node.next = this.head;
                    this.head.previous = node;
                    node.previous = null;
                    this.head = node;
                }
            }
        },

        mergeSort: function( sortFunction ) {
            if( this.head == this.tail ) {
                return;
            }
            var lists = [],
                start = this.head,
                end;
            while( start ) {
                end = start;
                while( end.next && sortFunction( end, end.next ) <= 0 ) {
                    end = end.next;
                }
                var next = end.next;
                start.previous = end.next = null;
                lists.push( start );
                start = next;
            }
            while( lists.length > 1 ) {
                lists.push( this.merge( lists.shift(), lists.shift(), sortFunction ) );
            }
            this.tail = this.head = lists[0];
            while( this.tail.next ) {
                this.tail = this.tail.next;
            }
        },

        merge: function( head1, head2, sortFunction ) {
            var node,
                head;
            if( sortFunction( head1, head2 ) <= 0 ) {
                head = node = head1;
                head1 = head1.next;
            } else {
                head = node = head2;
                head2 = head2.next;
            }
            while( head1 && head2 ) {
                if( sortFunction( head1, head2 ) <= 0 ) {
                    node.next = head1;
                    head1.previous = node;
                    node = head1;
                    head1 = head1.next;
                } else {
                    node.next = head2;
                    head2.previous = node;
                    node = head2;
                    head2 = head2.next;
                }
            }
            if( head1 ) {
                node.next = head1;
                head1.previous = node;
            } else {
                node.next = head2;
                head2.previous = node;
            }
            return head;
        }
    });

    return NodeList;
});

/**
 * Dictionary
 *
 * @author Brett Jephson
 */
define('brejep/dictionary',[
    'brejep/class'
], function (Class) {


    var Dictionary = Class.extend({
        VERSION: '0.1.0',
        keys: null,
        values: null,

        constructor: function () {
            this.keys = [];
            this.values = [];
            return this;
        },

        add: function (key, value) {
            var keyIndex = this.getIndex(key);
            if(keyIndex >= 0) {
                this.values[keyIndex] = value;
            } else {
                this.keys.push(key);
                this.values.push(value);
            }
        },

        remove: function (key) {
            var keyIndex = this.getIndex(key);
            if(keyIndex >= 0) {
                this.keys.splice(keyIndex, 1);
                this.values.splice(keyIndex, 1);
            } else {
                throw 'Key does not exist';
            }
        },

        retrieve: function (key) {
            var value = null;
            var keyIndex = this.getIndex(key);
            if(keyIndex >= 0) {
                value = this.values[ keyIndex ];
            }
            return value;
        },

        getIndex: function (testKey) {
            var i = 0,
                len = this.keys.length,
                key;
            for(; i<len; ++i){
                key = this.keys[i];
                if(key == testKey) {
                    return i;
                }
            }
            return -1;
        },

        has: function (testKey) {
            var i = 0,
                len = this.keys.length,
                key;
            for(; i<len; ++i){
                key = this.keys[i];
                if(key == testKey) {
                    return true;
                }
            }
            return false;
        },

        forEach: function (action) {
            var i = 0,
                len = this.keys.length,
                key,
                value;

            for(; i<len; ++i) {
                key = this.keys[i];
                value = this.values[i];
                var breakHere = action(key, value);
                if (breakHere === 'return') {
                    return false;
                }
            }
            return true;
        }
    });

    return Dictionary;
});

/**
 * Ash-js Component matching family
 *
 */
define('ash-core/componentmatchingfamily',[
    'ash-core/family',
    'ash-core/nodepool',
    'ash-core/nodelist',
    'brejep/dictionary'
], function (Family, NodePool, NodeList, Dictionary) {


    var ComponentMatchingFamily = Family.extend({
        constructor: function (nodeClass, engine) {
            this.nodeClass = nodeClass;
            this.engine = engine;
            this.__defineGetter__("nodeList", function() {
                return this.nodes;
            });

            this.nodes = new NodeList();
			this.entities = new Dictionary();
			this.components = new Dictionary();
            this.nodePool = new NodePool( this.nodeClass, this.components );

            this.nodePool.dispose( this.nodePool.get() );

            var nodeClassPrototype = this.nodeClass.prototype;

            for(var property in nodeClassPrototype) {
                ///TODO - tidy this up...
                if(nodeClassPrototype.hasOwnProperty(property) &&
                    property != "types" &&
                    property != "next" &&
                    property != "previous" &&
                    property != "constructor" &&
                    property != "super" &&
                    property != "extend" &&
                    property != "entity") {
                    var componentObject = nodeClassPrototype.types[property];
                    this.components.add(componentObject, property);
                }
            }
        },

        newEntity: function (entity) {
            this.addIfMatch(entity);
        },

        componentAddedToEntity: function (entity, componentClass) {
            this.addIfMatch(entity);
        },

        componentRemovedFromEntity: function (entity, componentClass) {
            if (this.components.has(componentClass)) {
                this.removeIfMatch(entity);
            }
        },

        removeEntity: function (entity) {
            this.removeIfMatch(entity);
        },

        cleanUp: function () {
            for (var node = this.nodes.head; node; node = node.next) {
                this.entities.remove(node.entity);
            }
            this.nodes.removeAll();
        },

        addIfMatch: function (entity) {
            if (!this.entities.has(entity)) {
                var componentClass;
                if (
                    !this.components.forEach(function(componentClass, componentName) {
                        if(!entity.has(componentClass)) {
                            return "return";
                        }
                    })
               ) { return; }
                var node = this.nodePool.get();
                node.entity = entity;
                this.components.forEach(function (componentClass, componentName) {
                    node[componentName] = entity.get(componentClass);
                });
                this.entities.add(entity, node);
                entity.componentRemoved.add(this.componentRemovedFromEntity, this);
                this.nodes.add(node);
            }
        },

        removeIfMatch: function (entity) {
            var entities = this.entities,
                nodes = this.nodes,
                engine = this.engine,
                nodePool = this.nodePool;

            if (entities.has(entity))
            {
                var node = entities.retrieve(entity);
                entity.componentRemoved.remove(this.componentRemovedFromEntity, this);
                entities.remove(entity);
                nodes.remove(node);
                if (engine.updating) {
                    nodePool.cache(node);
                    engine.updateComplete.add(this.releaseNodePoolCache, this);
                } else {
                    nodePool.dispose(node);
                }
            }
        },

        releaseNodePoolCache: function () {
            this.engine.updateComplete.remove(this.releaseNodePoolCache);
            this.nodePool.releaseCache();
        }
    });

    return ComponentMatchingFamily;
});

/**
 * Ash-js EntityList
 */
define('ash-core/entitylist',[
    'brejep/class'
], function (Class) {


    var EntityList = Class.extend({
        head: null, /* Entity */
        tail: null, /* Entity */

        constructor: function () { },

        add: function( entity ) {
            if( !this.head ) {
                this.head = this.tail = entity;
            } else {
                this.tail.next = entity;
                entity.previous = this.tail;
                this.tail = entity;
            }
        },

        remove: function( entity ) {
            if ( this.head == entity ) {
                this.head = this.head.next;
            }
            if ( this.tail == entity ) {
                this.tail = this.tail.previous;
            }
            if ( entity.previous ) {
                entity.previous.next = entity.next;
            }
            if ( entity.next ) {
                entity.next.previous = entity.previous;
            }
        },

        removeAll: function() {
            while( this.head ) {
                var entity = this.head;
                this.head = this.head.next;
                entity.previous = null;
                entity.next = null;
            }
            this.tail = null;
        }
    });

    return EntityList;
});

/**
 * Ash-js System List
 */
define('ash-core/systemlist',[
    'brejep/class'
], function (Class) {


    var SystemList = Class.extend({
        head: null, /* System */
        tail: null, /* System */

        constructor: function () { },

        add: function( system ) {
            if( !this.head ) {
                this.head = this.tail = system;
                system.next = system.previous = null;
            } else {
                for( var node = this.tail; node; node = node.previous ) {
                    if( node.priority <= system.priority ) {
                        break;
                    }
                }
                if( node === this.tail ) {
                    this.tail.next = system;
                    system.previous = this.tail;
                    system.next = null;
                    this.tail = system;
                } else if( !node ) {
                    system.next = this.head;
                    system.previous = null;
                    this.head.previous = system;
                    this.head = system;
                } else {
                    system.next = node.next;
                    system.previous = node;
                    node.next.previous = system;
                    node.next = system;
                }
            }
        },

        remove: function( system ) {
            if ( this.head === system ) {
                this.head = this.head.next;
            }
            if ( this.tail === system ) {
                this.tail = this.tail.previous;
            }
            if ( system.previous ) {
                system.previous.next = system.next;
            }
            if ( system.next ) {
                system.next.previous = system.previous;
            }
        },

        removeAll: function() {
            while( this.head )
            {
                var system = this.head;
                this.head = this.head.next;
                system.previous = null;
                system.next = null;
            }
            this.tail = null;
        },

        get: function( type ) {
            for( var system = this.head; system; system = system.next ) {
                if ( system.is( type ) ) {
                    return system;
                }
            }
            return null;
        }
    });

    return SystemList;
});

/**
 * Ash-js engine
 *
 */
define('ash-core/engine',[
    'ash-core/componentmatchingfamily',
    'ash-core/entitylist',
    'ash-core/systemlist',
    'signals',
    'brejep/dictionary',
    'brejep/class'
], function (ComponentMatchingFamily, EntityList, SystemList, signals, Dictionary, Class) {


    var Engine = Class.extend({
        familyClass: ComponentMatchingFamily,
        families: null,
        entityList: null,
        systemList: null,
        updating: false,
        updateComplete: new signals.Signal(),

        constructor: function () {
            this.entityList = new EntityList(),
            this.systemList = new SystemList();
            this.families = new Dictionary();

            this.__defineGetter__('entities', function() {
                var tmpEntities = [];
                for( var entity = this.entityList.head; entity; entity = entity.next )
                {
                    tmpEntities.push( entity );
                }
                return tmpEntities;
            });

            this.__defineGetter__('systems', function() {
                var tmpSystems = [];
                for( var system = this.systemList.head; system; system = system.next )
                {
                    tmpSystems.push( system );
                }
                return tmpSystems;
            });
        },

        addEntity: function (entity) {
            this.entityList.add( entity );
            entity.componentAdded.add( this.componentAdded, this );
            this.families.forEach( function( nodeObject, family ) {
                family.newEntity( entity );
            });
        },

        removeEntity: function (entity) {
            entity.componentAdded.remove( this.componentAdded, this );
            this.families.forEach( function( nodeObject, family ) {
                family.removeEntity( entity );
            });
            this.entityList.remove( entity );
        },

        removeAllEntities: function () {
            while( this.entityList.head ) {
                this.removeEntity( this.entityList.head );
            }
        },

        componentAdded: function (entity, componentClass) {
            this.families.forEach( function( nodeObject, family ) {
                family.componentAddedToEntity( entity, componentClass );
            });
        },

        getNodeList: function (nodeObject) {
            if( this.families.has( nodeObject ) ) {
                return this.families.retrieve( nodeObject ).nodes;
            }
            var family = new this.familyClass( nodeObject, this );
            this.families.add( nodeObject, family );
            for( var entity = this.entityList.head; entity; entity = entity.next ) {
                family.newEntity( entity );
            }
            return family.nodes;
        },

        releaseNodeList : function( nodeObject ) {
            if( this.families.has( nodeObject ) ) {
                this.families.retrieve( nodeObject ).cleanUp();
            }
            this.families.remove( nodeObject );
        },

        addSystem : function( system, priority ) {
            system.priority = priority;
            system.addToEngine( this );
            this.systemList.add( system );
        },

        getSystem : function( type ) {
            return this.systemList.get( type );
        },

        removeSystem : function( system ) {
            this.systemList.remove( system );
            system.removeFromEngine( this );
        },

        removeAllSystems : function() {
            while( this.systemList.head ) {
               this.removeSystem( this.systemList.head );
            }
        },

        update : function( time ) {
          var rc;
            this.updating = true;
            for( var system = this.systemList.head; system; system = system.next ) {
                rc=system.update( time );
                if (rc===false) { break; }
            }
            this.updating = false;
            this.updateComplete.dispatch();
        }
    });

    return Engine;
});

/**
 * Ash-js Entity
 *
 */
define('ash-core/entity',[
    'signals',
    'brejep/dictionary',
    'brejep/class'
], function (signals, Dictionary, Class) {


    var Entity = Class.extend({
        previous:null, /* Entity */
        next: null, /* Entity */
        components: null,

        constructor: function ()  {
            this.components = new Dictionary();
            this.componentAdded = new signals.Signal();
            this.componentRemoved = new signals.Signal();
        },

        add: function (component, componentClass ) {
			if( typeof componentClass === "undefined" )
			{
				componentClass = component.constructor;
			}
            if ( this.components.has( componentClass ) )
			{
                this.remove( componentClass );
            }
            this.components.add(componentClass, component);
            this.componentAdded.dispatch( this, componentClass );
            return this;
        },

        remove: function ( componentClass ) {
            var component = this.components.retrieve( componentClass );
            if ( component ) {
                this.components.remove( componentClass );
                this.componentRemoved.dispatch( this, componentClass );
                return component;
            }
            return null;
        },

        get: function (componentClass) {
            return this.components.retrieve( componentClass );
        },

        /**
         * Get all components from the entity.
         * @return {Array} Contains all the components on the entity
         */
        getAll: function () {
            var componentArray = [];
            this.components.forEach(function( componentObject, component ) {
                componentArray.push(component);
            });
            return componentArray;
        },

        has: function (componentClass) {
            return this.components.has( componentClass );
        }
    });

    return Entity;
});

/**
 * Ash-js Node
 */
define('ash-core/node',[
    'brejep/class'
], function (Class) {


    var Node = Class.extend({
        entity: null,
        previous: null,
        next: null,

        constructor: function () { }
    });

    /**
    * A simpler way to create a node.
    *
    * Example: creating a node for component classes Point &amp; energy:
    *
    * var PlayerNode = Ash.Node.create({
    *   point: Point,
    *   energy: Energy
    * });
    *
    * This is the simpler version from:
    *
    * var PlayerNode = Ash.Node.extend({
    *   point: null,
    *   energy: null,
    *
    *   types: {
    *     point: Point,
    *     energy: Energy
    *   }
    * });
    */
    Node.create = function (schema) {
        var processedSchema = {
            types: {},
            constructor: function () { }
        };

        // process schema
        for (var propertyName in schema) {
            if (schema.hasOwnProperty(propertyName)) {
                var propertyType = schema[propertyName];
                if (propertyType) {
                    processedSchema.types[propertyName] = propertyType;
                }
                processedSchema[propertyName] = null;
            }
        }

        return Node.extend(processedSchema);
    };

    return Node;
});

/**
 * Ash-js System
 */
define('ash-core/system',[
    'brejep/class'
], function (Class) {


    var System = Class.extend({
        previous: null, /* System */
        next: null, /* System */
        priority: 0,

        constructor: function () { },

        addToEngine: function (engine) {
            /* Left deliberately blank */
        },

        removeFromEngine: function (engine) {
            /* Left deliberately blank */
        },

        update: function (time) {
            /* Left deliberately blank */
        },

        is: function (type) {
            return type.prototype.isPrototypeOf(this);
        }
    });

    return System;
});

/**
 * Ash framework core
 *
 * @author Brett Jephson
 */
define('ash/ash-framework',['supplicate','ash-core/engine','ash-core/componentmatchingfamily','ash-core/entity','ash-core/entitylist','ash-core/family','ash-core/node','ash-core/nodelist','ash-core/nodepool','ash-core/system','ash-core/systemlist','brejep/class','signals'],function (supplicate) {
    var core = {
        VERSION: '0.2.0'
    };

    core.Engine = supplicate('ash-core/engine');
    core.ComponentMatchingFamily = supplicate('ash-core/componentmatchingfamily');
    core.Entity = supplicate('ash-core/entity');
    core.EntityList = supplicate('ash-core/entitylist');
    core.Family = supplicate('ash-core/family');
    core.Node = supplicate('ash-core/node');
    core.NodeList = supplicate('ash-core/nodelist');
    core.NodePool = supplicate('ash-core/nodepool');
    core.System = supplicate('ash-core/system');
    core.SystemList = supplicate('ash-core/systemlist');

    // util classes
    // TODO separate this?
    core.Class = supplicate('brejep/class');
    core.Signals = supplicate('signals');

    return core;
});

  var library = supplicate('ash/ash-framework');
  if(typeof module !== 'undefined' && module.exports) {
    module.exports = library;
  } else if(globalDefine) {
    (function (define) {
      define('ash-js', [], function () { return library; });
    }(globalDefine));
  } else {
    global['Ash'] = library;
  }
}(this));
