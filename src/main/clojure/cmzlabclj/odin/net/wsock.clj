;; This library is distributed in  the hope that it will be useful but without
;; any  warranty; without  even  the  implied  warranty of  merchantability or
;; fitness for a particular purpose.
;; The use and distribution terms for this software are covered by the Eclipse
;; Public License 1.0  (http://opensource.org/licenses/eclipse-1.0.php)  which
;; can be found in the file epl-v10.html at the root of this distribution.
;; By using this software in any  fashion, you are agreeing to be bound by the
;; terms of this license. You  must not remove this notice, or any other, from
;; this software.
;; Copyright (c) 2013-2014, Ken Leung. All rights reserved.

(ns ^{:doc ""
      :author "kenl" }

  cmzlabclj.odin.net.wsock

  (:require [clojure.tools.logging :as log :only (info warn error debug)]
            [clojure.string :as cstr]
            [clojure.data.json :as json])

  (:use [cmzlabclj.xlib.util.dates :only [ParseDate] ]
        [cmzlabclj.xlib.util.str :only [hgl? strim] ]
        [cmzlabclj.tardis.core.constants]
        [cmzlabclj.tardis.core.wfs]
        [cmzlabclj.tardis.impl.ext :only [GetAppKeyFromEvent] ])

  (:use [cmzlabclj.odin.system.core]
        [cmzlabclj.odin.event.core])

  (:import  [com.zotohlab.gallifrey.core Container ConfigError]
            [org.apache.commons.io FileUtils]
            [com.zotohlab.wflow FlowNode Activity
                                Pipeline PipelineDelegate PTask Work]
            [com.zotohlab.gallifrey.io WebSockEvent Emitter]
            [com.zotohlab.frwk.io IOUtils XData]
            [com.zotohlab.wflow.core Job]
            [java.io File]
            [java.util Date ArrayList List HashMap Map]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doStart ""

  ^PTask
  []

  (DefWFTask
    (fn [fw ^Job job arg]
      (let [^WebSockEvent evt (.event job)
            ^XData data (.getData evt)
            co (.container (.emitter evt)) ]
        (OdinOnEvent (DecodeEvent (.stringify data)
                                  (.getSocket evt)))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype Handler [] PipelineDelegate

  (getStartActivity [_  pipe]
    (require 'cmzlabclj.odin.net.wsock)
    (doStart))

  (onStop [_ pipe]
    (log/debug "Handler: stopped."))

  (onError [ _ err curPt]
    (log/error "Handler: I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private wsock-eof nil)

