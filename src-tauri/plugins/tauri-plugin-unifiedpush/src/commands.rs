use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, Runtime};

use crate::mobile;

#[derive(Debug, Deserialize, Serialize)]
pub struct DistributorArgs {
    pub distributor: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TokenArgs {
    pub token: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PushNotificationResponse {
    pub endpoint: String,
    pub instance: String,
    pub pub_key_set: Option<UnifiedPushPublicKeySet>,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct UnifiedPushPublicKeySet {
    pub pub_key: String,
    pub auth: String,
}

#[derive(Debug, Deserialize)]
pub struct DistributorsResponse {
    pub distributors: Vec<String>,
}

#[derive(Debug, Deserialize)]
pub struct SavedDistributorResponse {
    pub distributor: String,
}

#[tauri::command]
pub async fn list_distributors<R: Runtime>(_app: AppHandle<R>) -> Result<Vec<String>, String> {
    let plugin = _app.state::<mobile::UnifiedPush<R>>().inner().0.clone();
    plugin
        .run_mobile_plugin_async::<DistributorsResponse>("listDistributors", ())
        .await
        .map(|r| r.distributors)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_distributor<R: Runtime>(
    _app: AppHandle<R>,
    args: DistributorArgs,
) -> Result<(), String> {
    let plugin = _app.state::<mobile::UnifiedPush<R>>().inner().0.clone();
    plugin
        .run_mobile_plugin::<()>("setDistributor", args)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn register_for_push_notifications<R: Runtime>(
    _app: AppHandle<R>,
) -> Result<PushNotificationResponse, String> {
    let plugin = _app.state::<mobile::UnifiedPush<R>>().inner().0.clone();
    plugin
        .run_mobile_plugin_async::<PushNotificationResponse>("registerForPushNotifications", ())
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn unregister_for_push_notifications<R: Runtime>(
    _app: AppHandle<R>,
) -> Result<(), String> {
    let plugin = _app.state::<mobile::UnifiedPush<R>>().inner().0.clone();
    plugin
        .run_mobile_plugin::<()>("unregisterForPushNotifications", ())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn set_token<R: Runtime>(_app: AppHandle<R>, args: TokenArgs) -> Result<(), String> {
    let plugin = _app.state::<mobile::UnifiedPush<R>>().inner().0.clone();
    plugin
        .run_mobile_plugin::<()>("setToken", args)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_saved_distributor<R: Runtime>(_app: AppHandle<R>) -> Result<String, String> {
    let plugin = _app.state::<mobile::UnifiedPush<R>>().inner().0.clone();
    plugin
        .run_mobile_plugin::<SavedDistributorResponse>("getSavedDistributor", ())
        .map(|r| r.distributor)
        .map_err(|e| e.to_string())
}
