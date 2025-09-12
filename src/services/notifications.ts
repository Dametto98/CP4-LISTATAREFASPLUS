import * as Notification from "expo-notifications"
import * as Device from "expo-device"

Notification.setNotificationHandler({
    handleNotification:async()=>({
        shouldShowBanner:true,//Exibe o banner
        shouldShowList:true,//Mostra histórico
        shouldPlaySound:true,//Toca o som
        shouldSetBadge:false//Não altera o badge
    })
})