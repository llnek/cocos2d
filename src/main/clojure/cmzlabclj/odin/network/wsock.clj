
(ns ^{:doc ""
      :author "kenl" }

  cmzlabclj.odin.network.wsock

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [cmzlabclj.nucleus.util.dates :only [ParseDate] ]
        [cmzlabclj.nucleus.util.str :only [hgl? strim] ]
        [cmzlabclj.tardis.core.constants]
        [cmzlabclj.tardis.core.wfs]
        [cmzlabclj.tardis.impl.ext :only [GetAppKeyFromEvent] ])

  (:import  [com.zotohlab.gallifrey.core Container ConfigError]
            [org.apache.commons.io FileUtils]
            [com.zotohlab.wflow FlowPoint Activity
                                Pipeline PipelineDelegate PTask Work]
            [com.zotohlab.gallifrey.io WebSockEvent Emitter]
            [com.zotohlab.frwk.net ULFormItems ULFileItem]
            [com.zotohlab.frwk.io IOUtils XData]
            [com.zotohlab.wflow.core Job]
            [java.io File]
            [java.util Date ArrayList List HashMap Map]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doXXX ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^WebSockEvent evt (.event job)
            ^cmzlabclj.tardis.core.sys.Element
            src (.emitter evt)
            ^cmzlabclj.tardis.impl.ext.ContainerAPI
            co (.container ^Emitter src) 
            ^XData data (.getData evt) ]
        (log/debug "DUDE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        (log/debug "data = " (.stringify data))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype Handler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.odin.network.wsock)
    (doXXX))

  (onStop [_ pipe]
    (log/info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (log/info "Oops, I got an error!")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private wsock-eof nil)


