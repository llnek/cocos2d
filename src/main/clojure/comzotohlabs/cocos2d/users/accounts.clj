
(ns  ^{ :doc ""
        :author "kenl" }

  comzotohlabs.cocos2d.users.accounts )


(import '( com.zotohlabs.wflow
  If FlowPoint Activity Pipeline PipelineDelegate PTask Work))
(import '(com.zotohlabs.gallifrey.io HTTPEvent HTTPResult))
(import '(com.zotohlabs.wflow.core Job))

(use '[clojure.tools.logging :only (info warn error debug)])
(use '[comzotohlabscljc.tardis.core.wfs])
(use '[comzotohlabscljc.tardis.auth.core :only [maybeSignupTest
                                            maybeLoginTest] ])

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn- doSignupFail "" ^PTask []
  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 500)
        (.replyResult evt)))))

(defn- doSignupOK "" ^PTask []
  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 200)
        (.setContent res "You're signed up!!")
        (.setHeader res "content-type" "text/plain")
        (.replyResult evt)))))

(deftype SignupHandler [] PipelineDelegate
  (getStartActivity [_  pipe]
    (require 'comzotohlabs.cocos2d.users.accounts)
    (debug "signup pipe-line - called.")
    (If. (maybeSignupTest) (doSignupOK) (doSignupFail)))

  (onStop [_ pipe]
    (info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (info "Oops, I got an error!")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(defn- doLoginFail "" ^PTask []
  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 500)
        (.replyResult evt)))))

(defn- doLoginOK "" ^PTask []
  (DefWFTask
    (perform [_ fw job arg]
      (let [ ^HTTPEvent evt (.event job)
             ^comzotohlabscljc.tardis.io.ios.WebSession
             mvs (.getSession evt)
             ^HTTPResult res (.getResultObj evt) ]
        (.setStatus res 200)
        (.setContent res "You're logged-in !!!")
        (.setHeader res "content-type" "text/plain")
        (.replyResult evt)))))

(deftype LoginHandler [] PipelineDelegate
  (getStartActivity [_  pipe]
    (require 'comzotohlabs.cocos2d.users.accounts)
    (debug "login pipe-line - called.")
    (If. (maybeLoginTest) (doLoginOK) (doLoginFail)))

  (onStop [_ pipe]
    (info "nothing to be done here, just stop please."))

  (onError [ _ err curPt]
    (info "Oops, I got an error!")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;


(def ^:private pipe-eof nil)




