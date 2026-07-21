package dev.understars.shoot.unifiedpush

import android.content.Context
import org.unifiedpush.android.connector.FailedReason
import org.unifiedpush.android.connector.MessagingReceiver
import org.unifiedpush.android.connector.data.PushEndpoint
import org.unifiedpush.android.connector.data.PushMessage

class UnifiedPushReceiver : MessagingReceiver() {
    override fun onNewEndpoint(context: Context, endpoint: PushEndpoint, instance: String) {
        UnifiedPushPlugin.instance?.onNewEndpoint(endpoint, instance)
    }

    override fun onRegistrationFailed(context: Context, reason: FailedReason, instance: String) {
        UnifiedPushPlugin.instance?.onRegistrationFailed(reason.name)
    }

    override fun onUnregistered(context: Context, instance: String) {
        UnifiedPushPlugin.instance?.onUnregistered()
    }

    override fun onMessage(context: Context, message: PushMessage, instance: String) {
        val content = String(message.content, Charsets.UTF_8)
        val plugin = UnifiedPushPlugin.instance
        if (plugin != null) {
            plugin.onMessage(content, null)
        } else {
            UnifiedPushNotifier.showFromPush(context, content)
        }
    }
}
