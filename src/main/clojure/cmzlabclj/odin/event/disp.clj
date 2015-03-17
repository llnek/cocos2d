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

  cmzlabclj.odin.event.disp

  (:require [clojure.tools.logging :as log :only [info warn error debug] ]
            [clojure.data.json :as json]
            [clojure.string :as cstr])

  (:use [cmzlabclj.nucleus.util.core
         :only [ThrowUOE MakeMMap ternary test-nonil notnil? ] ]
        [cmzlabclj.nucleus.util.str :only [strim nsb hgl?] ])

  (:import  [org.jetlang.core Callback Disposable]
            [org.jetlang.fibers Fiber ThreadFiber]
            [org.jetlang.channels MemoryChannel]
            [java.util HashMap]
            [com.zotohlab.odin.event EventHandler EventDispatcher]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;(set! *warn-on-reflection* true)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(defn ReifyEventDispatcher ""

  ^EventDispatcher
  []

  (let [queue (MemoryChannel.)
        handlers (ref {})
        fiber (ThreadFiber.) ]
    (.start fiber)
    (reify EventDispatcher
      (unsubscribeIfSession [_ s]
        (dosync
          (doseq [^EventHandler k (keys @handlers)]
            (when-let [ps (.session k)]
              (when (identical? ps s)
                (.dispose ^Disposable (get @handlers k))
                (alter handlers dissoc k))))))

      (unsubscribe [_ cb]
        (dosync
        (if-let [^Disposable d (get @handlers cb) ]
          (.dispose d)
          (alter handlers dissoc cb))))

      (subscribe [_ cb]
        (let [^EventHandler hdlr cb
              d (.subscribe
                  queue
                  fiber
                  (reify Callback
                    (onMessage [_ msg]
                      (when (== (.eventType hdlr)
                                (int (:type msg)))
                        (.onEvent hdlr msg))))) ]
          (dosync
            (alter handlers assoc cb d))
          d))

      (publish [_ msg]
        (log/debug "publishing message ==== " msg)
        (.publish queue msg))

      (shutdown [_]
        (.clearSubscribers queue)
        (.dispose fiber)
        (dosync (ref-set handlers nil))))
  ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;
(def ^:private disp-eof nil)

