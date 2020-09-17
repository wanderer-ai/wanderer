# todo

* den ordner static aus wanderer-chat-vue-component löschen. kein peil, was das file da drinnen macht. 
* [OK] Bei dem commit und createn von neuen chat messages kann vermutlich das data attribut weg und durch vertexId ersetzt werden. Weil data soll nur aus vueX kommen. Bei den questions kommen die suggestions auch daher...
* [OK] Wo ist der unterschied zwischen truncate und reset-chat event? Es gibt gerade beide

* [OK] Manchmal klemmt der chat im tutorial und geht nicht los. Es geht aber wenn ich das panel kurz schließe und wieder öffne -> Lag daran, dass ein wert in der basiskomponente on reset nicht gelöscht wurde

* [OK] Ich bekomme eionen krassen recursion error, wenn ich eine Edge zurück erstelle von einem Node auf einen anderen -> Habe jetzt gesagt, sdass jeder node pro Traversal nur einmal besucht werden darf

* Beim Laden des new chat flow crashed alles^^ Aber auch nur, wenn vorher zum Beispiel das Tutorial an war :-) -> Habe ich nicht mehr beobachtet

* Den CytoscapeSingleton rauswerfen aus den Messages! Den brauche ich nicht! Außer im Builder! Und evtl. in builder plugins.
* Dann eingenen Traversal implementieren. kann nicht so schwer sein.

* [OK] Bitte mal danach im Code suchen: wir ticken doch jetzt. Evtl startet noch irgendwo das traversal und das würde sich häufwen und die Performance mit der Zeit runter ziehen: WandererSingleton.traverse()

* [OK] Die Antworten werden nun gelöscht, wenn eine Frage erneut gestellt wird. Klar logisch. Wird ja auch überschrieben.

* [OK] Verbotene Edges gehen noch nicht. Sie gehen aber sie gehen nur, wenn sie auch zuerst besucht wurden. Denn nur dann werden diese rechtzeitig geprüft. Und zwar von der allowTargetTraversal() der leadsTo definition. -> OK. Gibt nun einen Test Traversal mit einem test Visitor zum Sammeln von Informationen

* Prüfen, ob wir die normalen Visitors überhaupt noch brauchen im traversal der edges. Evtl. reichen da auch die testVisitors

* Das löschen von vielen Nodes führt zu infinite Error? -> Ja weil der doch die ganze zeit am traversen ist. Und dann sind plötzlich Daten weg!

* [OK] Das pulsen soll nur eine animation sein statt viele! -> Node sammeln

* Text scaled manchmal seltsam nach cytoscape upgrade

* Den section finisher leiber in einen testFinisher testVisitor umwandeln? Dann ist das Ergebnis gleich da für den Haupttraversal ud kann die letzte ausgehende Route aktivieren?

* Bei restart des Chats bleibenmacnhe nodes einfach in ihrer knalligen farbe, wenn diese nun nicht mehr durch die pulse animation erreicht werden...

* Einer der Bots geht nicht mehr wegen irgendeiner edge condition -> Ich glaube der mit dem Finisher

* Mal die Buttons im Add Menu schöner machen
