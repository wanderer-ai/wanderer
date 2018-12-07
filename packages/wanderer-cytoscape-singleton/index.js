import cytoscape from 'cytoscape';

// Todo: Das cxtmenu evtl erst in der builder component initialisieren???
import cxtmenu from 'cytoscape-cxtmenu';
cytoscape.use( cxtmenu )

export default class Cytoscape {

  // static initHead (config) {
  //
  //   cytoscape.use( cxtmenu )
  //   this.initHeadless(config)
  //
  // }

  static init (config) {

    if (this.instance){

      // Export data
      let json = this.instance.json()

      // Destroy cy
      this.instance.destroy()

      // Init new cy instance
      this.instance = cytoscape(config)

      // Import to cy
      this.instance.json(json)

    }else{

      // Init cy
      this.instance = cytoscape(config)

    }

  }

  static get cy () {
    return this.instance
  }

}
