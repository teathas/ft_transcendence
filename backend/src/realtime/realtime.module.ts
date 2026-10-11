import { Module } from "@nestjs/common";
import { RealtimeGateway } from "./realtime.gateway";
import { AuthModule } from "../auth/auth.module";
import { RealtimeService } from "./realtime.service";
import { PresenceService } from "./presence.service";

@Module({
	imports: [AuthModule],
	providers: [RealtimeGateway, RealtimeService, PresenceService],
	exports: [RealtimeService],
})
export class RealtimeModule {}