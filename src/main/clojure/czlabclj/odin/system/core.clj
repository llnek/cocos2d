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

  czlabclj.odin.system.core

  (:require [clojure.tools.logging :as log :only [info warn error debug]]
            [clojure.string :as cstr])

  (:use [czlabclj.xlib.util.core :only [MakeMMap ternary notnil?]]
        [czlabclj.xlib.util.files :only [ReadOneFile]]
        [czlabclj.xlib.util.format]
        [czlabclj.xlib.util.str :only [strim nsb hgl?]]
        [czlabclj.xlib.util.wfs :only [SimPTask]]
        [czlabclj.odin.event.core]
        [czlabclj.odin.game.msgreq])

  (:import  [io.netty.handler.codec.http.websocketx TextWebSocketFrame]
            [com.zotohlab.wflow Job Activity
                                Pipeline PDelegate PTask]
            [com.zotohlab.skaro.io WebSockEvent Emitter]
            [com.zotohlab.frwk.io IOUtils XData]
            [java.io File]
            [io.netty.channel Channel]
            [com.zotohlab.skaro.core Container]
            [com.zotohlab.odin.event Msgs Events]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Main entry point.
(defn OdinOnEvent ""

  [^Container ctr evt]

  (let [etype (:type evt)]
    (condp = etype
      Events/PLAYGAME_REQ
      (DoPlayReq ctr evt)

      Events/JOINGAME_REQ
      (DoJoinReq ctr evt)

      (log/warn "unhandled event " evt))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; One time init from the MainApp.
(defn OdinInit ""

  [^Container ctr]

  ;;TODO: loading in Odin config file. do something with it?
  (let [appDir (.getAppDir ctr)
        fp (File. appDir "conf/odin.conf")
        s (ReadOneFile fp)
        json (ReadJsonKW s) ]
    (log/info "Odin config= " s)
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn- doStart ""

  ^Activity
  []

  (SimPTask
    (fn [^Job j]
      (let [^WebSockEvent evt (.event j)
            ^XData data (.getData evt)
            co (.container (.emitter evt)) ]
        (OdinOnEvent co (DecodeEvent (.stringify data)
                                  (.getSocket evt)))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(deftype Handler [] PDelegate

  (onError [ _ err curPt] (log/error "Handler: I got an error!"))
  (onStop [_ pipe] )

  (startWith [_  pipe]
    (require 'czlabclj.odin.system.core)
    (doStart)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private core-eof nil)

