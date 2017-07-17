// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Johnathan Olson (PhET Interactive Simulations)
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var griddle = require( 'GRIDDLE/griddle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   */
  function VerticalBarNode( property, options ) {
    options = _.extend( {
      fill: 'blue',
      stroke: 'black',
      lineWidth: 0,
      label: null,
      width: 30,
      maxBarHeight: 300,
      displayContinuousArrow: false,
      visible: true
    }, options );

    this.maxBarHeight = options.maxBarHeight;

    Node.call( this );

    // @public Creates the body of the bar.
    this.rectangleNode = new Rectangle( 0, 0, options.width, 100, {
      fill: options.fill,
      stroke: options.stroke,
      lineWidth: options.lineWidth,
      visible: options.visible
    } );
    this.addChild( this.rectangleNode );

    // @public Arrow node used to indicate when the value has gone beyond the scale of this meter
    this.arrowNode = new ArrowNode( this.rectangleNode.centerX, -options.maxBarHeight - 8, this.rectangleNode.centerX, -options.maxBarHeight - 25, {
      fill: options.fill,
      headWidth: options.width,
      tailWidth: 10,
      stroke: 'black',
      visible: options.visible
    } );
    this.addChild( this.arrowNode );

    // Determines whether the arrow should be shown
    this.displayContinuousArrow = new Property( options.displayContinuousArrow );

    // Link that changes the height of the bar based on the property associated with the bar.
    this.handleBarHeightChanged = this.updateBarHeight.bind( this );
    this.setMonitoredProperty( property );

    this.mutate( options );
  }

  griddle.register( 'VerticalBarNode', VerticalBarNode );

  return inherit( Node, VerticalBarNode, {

    /**
     * Replace the Property for the barNode with the new Property passed in.
     * @param {Property.<number>} property
     *
     * @public
     */
    setMonitoredProperty: function( property ) {

      // We can skip the unlink the first time this is called. The next time this is called property will be defined.
      this.property && this.property.unlink( this.handleBarHeightChanged );
      this.property = property;
      this.property.link( this.handleBarHeightChanged );
    },

    // TODO: add docs
    updateBarHeight: function( value ) {
      this.rectangleNode.visible = ( value > 0 ); // because we can't create a zero height rectangle
      var height = Math.max( 0.0000001, value ); // bar must have non-zero size
      this.rectangleNode.setRectHeight( Math.min( this.maxBarHeight, height ) ); // caps the height of the bar
      this.rectangleNode.bottom = 0;

      // Change the visibility of the arrowNode
      this.arrowNode.visible = ( this.rectangleNode.getRectHeight() === this.maxBarHeight);

    }
  } );
} );