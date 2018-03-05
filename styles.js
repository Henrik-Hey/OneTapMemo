const React = require('react-native')
const {StyleSheet} = React
const constants = {
  actionColor: '#FFC107',
  addLocationButtonSize : 300,
};

var styles = StyleSheet.create({  
  addLocationContainer : {
    alignItems:'center',
    justifyContent:'center',
    paddingTop: 120,
    paddingBottom: 120,
  },
  addLocationText : {
    fontSize: 100,
    color: '#fff',
  },
  addLocation : {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:constants.addLocationButtonSize,
    height:constants.addLocationButtonSize,
    backgroundColor:'#5E35B1',
    borderRadius:constants.addLocationButtonSize,
    margin: 'auto',
  },
  container: {
    backgroundColor: '#272727',
    flex: 1
  },
  listViewContainer: {
    backgroundColor: '#272727',
  },
  listview: {
    height: '78%'
  },
  li: {
    backgroundColor: '#272727',
    borderBottomColor: '#424242',
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  liContainer: {
    backgroundColor: '#000',
  },
  liText: {
    color: '#fff',
    fontSize: 16,
  },
  navbar: {
    borderBottomColor: '#111',
    borderColor: 'transparent',
    borderWidth: 1,
    height: 44,
    flexDirection: 'row'
  },
  navbarTitle: {
    paddingLeft : '5%',
    textAlign : 'left',
    color: '#fff',
    fontSize: 24,
    fontWeight: "900"
  },
  statusbar: {
    height: 22,
  },
  center: {
    textAlign: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  action: {
    backgroundColor: constants.actionColor,
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  locationModal: {
    backgroundColor: '#272727',
    height: '100%',
    width : '100%',
  },
  locationModalItemHeader: {
      paddingTop: '5%',
      paddingLeft: '5%',
      fontSize: 20,
      color: '#fff',
  },
  locationModalItemContent: {
    paddingLeft: '6%',
    fontSize: 15,
    color: '#fff'
  }
})

module.exports = styles
module.exports.constants = constants;