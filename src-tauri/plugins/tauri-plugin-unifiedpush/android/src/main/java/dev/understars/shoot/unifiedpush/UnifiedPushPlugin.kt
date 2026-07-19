package dev.understars.shoot.unifiedpush

import android.app.Activity
import android.content.Context
import app.tauri.annotation.Command
import app.tauri.annotation.InvokeArg
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Invoke
import app.tauri.plugin.JSArray
import app.tauri.plugin.JSObject
import app.tauri.plugin.Plugin
import org.unifiedpush.android.connector.UnifiedPush
import org.unifiedpush.android.connector.data.PushEndpoint

@InvokeArg
class DistributorArgs {
    var distributor: String? = null
}

@InvokeArg
class TokenArgs {
    var token: String? = null
}

@TauriPlugin
class UnifiedPushPlugin(private val activity: Activity): Plugin(activity) {

    companion object {
        var instance: UnifiedPushPlugin? = null
    }

    override fun load(webView: android.webkit.WebView) {
        super.load(webView)
        instance = this
    }

    @Command
    fun listDistributors(invoke: Invoke) {
        val distributors = UnifiedPush.getDistributors(activity)
        val result = JSObject()
        val arr = JSArray()
        distributors.forEach { arr.put(it) }
        result.put("distributors", arr)
        invoke.resolve(result)
    }

    @Command
    fun setDistributor(invoke: Invoke) {
        val args = invoke.parseArgs(DistributorArgs::class.java)
        val distributor = args.distributor
        if (distributor == null) {
            invoke.reject("Distributor parameter is required")
            return
        }
        UnifiedPush.saveDistributor(activity, distributor)
        invoke.resolve()
    }

    @Command
    fun registerForPushNotifications(invoke: Invoke) {
        val distributor = UnifiedPush.getSavedDistributor(activity)
        if (distributor == null) {
            invoke.reject("No UnifiedPush distributor selected")
            return
        }
        UnifiedPush.register(activity, "default")
        pendingRegistration = invoke
    }

    @Command
    fun unregisterForPushNotifications(invoke: Invoke) {
        UnifiedPush.unregister(activity, "default")
        invoke.resolve()
    }

    @Command
    fun setToken(invoke: Invoke) {
        invoke.resolve()
    }
    
    @Command
    fun getSavedDistributor(invoke: Invoke) {
		val distributor = UnifiedPush.getSavedDistributor(activity) ?: ""
		
		val result = JSObject()
		result.put("distributor", distributor)
		invoke.resolve(result)
    }

    private var pendingRegistration: Invoke? = null

    fun onNewEndpoint(endpoint: PushEndpoint, instance: String) {
        val result = JSObject()
        result.put("endpoint", endpoint.url)
        result.put("instance", instance)
        
        val pubKey = endpoint.pubKeySet
        if (pubKey != null) {
        	val keySet = JSObject()
			keySet.put("pubKey", pubKey.pubKey)
			keySet.put("auth", pubKey.auth)
			result.put("pubKeySet", keySet);
        }

        pendingRegistration?.resolve(result)
        pendingRegistration = null
    }

    fun onRegistrationFailed(reason: String?) {
        pendingRegistration?.reject(reason ?: "UnifiedPush registration failed")
        pendingRegistration = null
    }

    fun onUnregistered() {
        pendingRegistration?.resolve(JSObject())
        pendingRegistration = null
    }

    fun onMessage(message: String, eventId: String?) {
        val data = JSObject()
        data.put("message", message)
        if (eventId != null) data.put("eventId", eventId)
        trigger("push-message", data)
    }
}
