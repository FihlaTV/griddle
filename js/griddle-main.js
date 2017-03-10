// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main file for the Griddle library demo.
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Color = require( 'SCENERY/util/Color' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var XYPlot = require( 'GRIDDLE/XYPlot' );
  var XYDataSeries = require( 'GRIDDLE/XYDataSeries' );

  // strings
  var griddleTitleString = require( 'string!GRIDDLE/griddle.title' );

  var simOptions = {
    credits: {
      leadDesign: 'PhET'
    }
  };

  SimLauncher.launch( function() {
    // Create and start the sim
    new Sim( griddleTitleString, [
      new Screen(

        // createModel
        function() {
          return {
            step: function() {
            }
          };
        },

        // createView
        function( model ) {
          var screenView = new ScreenView( { layoutBounds: new Bounds2( 0, 0, 768, 504 ) } );
          var time = 0;
          var plot = new XYPlot( { backgroundFill: '#efecd9' } );
          var plotPanel = new Panel ( plot, {
            fill: '#efecd9',
            xMargin: 10,
            yMargin: 10
          } );
          screenView.addChild( plotPanel );
          var series = new XYDataSeries( { color: Color.BLUE } );
          plot.addSeries( series, false );
          var forward = true;
          var count = 0;
          screenView.step = function() {
            series.addPoint( time, -Math.abs( -Math.sin( time / 100 + count ) * 400 * 0.8 ) );
            time = time + (forward ? 1 : -1);

            if ( time > 400 ) {
              forward = false;
              count++;
            }
            if ( time < 0 ) {
              forward = true;
              count++;
            }
          };
          return screenView;
        },

        // options
        {
          backgroundColorProperty: new Property( '#fff' )
        }
      )
    ], simOptions ).start();
  } );
} );
