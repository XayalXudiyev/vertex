"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearPin } from "@/store/slices/mapSlice";
import { useReverseGeocodeQuery } from "@/store/api/locationsApi";

export function PinInfoCard() {
  const dispatch = useAppDispatch();
  const { selectedPin, center, zoom } = useAppSelector((s) => s.map);

  const { data: reverseData, isFetching } = useReverseGeocodeQuery(
    { lat: selectedPin?.lat ?? 0, lon: selectedPin?.lon ?? 0 },
    { skip: !selectedPin }
  );

  if (!selectedPin) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <MapPin className="mb-2 size-8 opacity-40" />
          <p className="text-sm">Xəritəyə klikləyin və ya yer axtarın</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {isFetching
              ? "Yüklənir..."
              : reverseData?.display_name.split(",")[0] ?? selectedPin.label}
          </CardTitle>
          <button
            type="button"
            onClick={() => dispatch(clearPin())}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {reverseData?.type && (
            <Badge variant="secondary">{reverseData.type}</Badge>
          )}
          {reverseData?.address?.country && (
            <Badge variant="outline">{reverseData.address.country}</Badge>
          )}
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Enlik</p>
            <p className="font-mono font-medium">{selectedPin.lat.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Uzunluq</p>
            <p className="font-mono font-medium">{selectedPin.lon.toFixed(6)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Zoom</p>
            <p className="font-mono font-medium">{zoom}</p>
          </div>
          {reverseData?.address?.city && (
            <div>
              <p className="text-xs text-muted-foreground">Şəhər</p>
              <p className="font-medium">{reverseData.address.city}</p>
            </div>
          )}
        </div>

        {reverseData?.display_name && (
          <>
            <Separator />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {reverseData.display_name}
            </p>
          </>
        )}

        <Button
          size="sm"
          variant="outline"
          className="w-full gap-2"
          onClick={() =>
            window.open(
              `https://www.google.com/maps?q=${selectedPin.lat},${selectedPin.lon}`,
              "_blank"
            )
          }
        >
          <Navigation className="size-3.5" />
          Google Maps-də aç
        </Button>
      </CardContent>
    </Card>
  );
}
