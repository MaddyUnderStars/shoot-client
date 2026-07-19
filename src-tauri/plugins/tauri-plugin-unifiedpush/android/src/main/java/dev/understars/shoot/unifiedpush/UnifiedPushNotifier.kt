package dev.understars.shoot.unifiedpush

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import org.json.JSONObject
import app.tauri.Logger

object UnifiedPushNotifier {
    private const val CHANNEL_ID = "messages"

    fun showFromPush(context: Context, rawMessage: String) {
		Logger.debug(Logger.tags("dev.understars.shoot", "showFromPush called: ${rawMessage}"))
    	
        val notification = try {
            JSONObject(rawMessage)
        } catch (e: Exception) {
            null
        } ?: return

        val title = notification.optString("title").ifEmpty { "New message" }
        val body = notification.optString("body")
        val channel = notification.optString("channel")

        ensureChannel(context)

        val iconId = context.resources
            .getIdentifier("notification_icon", "drawable", context.packageName)
            .takeIf { it != 0 } ?: android.R.drawable.ic_dialog_info

        val builder = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(iconId)
            .setContentTitle(title)
            .setContentText(body)
            .setAutoCancel(true)
            .setPriority(NotificationCompat.PRIORITY_HIGH)

        context.packageManager.getLaunchIntentForPackage(context.packageName)?.let { intent ->
            builder.setContentIntent(
                PendingIntent.getActivity(
                    context,
                    channel.hashCode(),
                    intent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
            )
        }

        // TODO: the sent timestamp should not be used as an ID here
        // ID should be generated server-side so that duplicate notifications aren't delivered
        val id = notification.getInt("sent")
        NotificationManagerCompat.from(context).notify(id, builder.build())
    }
    
    private fun ensureChannel(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return
        val manager = context.getSystemService(NotificationManager::class.java) ?: return
        if (manager.getNotificationChannel(CHANNEL_ID) == null) {
            manager.createNotificationChannel(
                NotificationChannel(CHANNEL_ID, "Messages", NotificationManager.IMPORTANCE_HIGH).apply {
                    description = "Messages"
                }
            )
        }
    }
}
