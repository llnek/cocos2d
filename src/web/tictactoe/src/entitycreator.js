
(function (undef) { "use strict"; var global = this, _ = global._ ;


//////////////////////////////////////////////////////////////////////////////
//
var EntityCreator = Ash.Class.extend({

  constructor: function (engine) {
    this.engine = engine;
    return this;
  },

  engine: null,

  destroyEntity: function(e) {
    this.engine.removeEntity(e);
  },

  createPlayer: function() {
    var p = new Ash.Entity()
        .add(new Asteroid())
        .add(new Position(x, y, 0, radius))
        .add(
            new Motion(
                (Math.random() - 0.5) * 4 * (50 - radius),
                (Math.random() - 0.5) * 4 * (50 - radius),
                Math.random() * 2 - 1,
                0
           )
       )
        .add(new Display(new AsteroidView(radius, this.graphics)));

    this.engine.addEntity(p);
    return p;
  },

  createBoard: function() {
    var b = new Ash.Entity()
        .add(new Spaceship())
        .add(new Position(400, 300, 1, 6))
        .add(new Motion(0, 0, 0, 15))
        .add(new MotionControls(Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, 100, 3))
        .add(new Gun(8, 0, 0.3, 2))
        .add(new GunControls(Keyboard.Z))
        .add(new Display(new SpaceshipView(this.graphics)));
    this.engine.addEntity(b);
    return b;
  }

});


}).call(this);

//////////////////////////////////////////////////////////////////////////////
//EOF

