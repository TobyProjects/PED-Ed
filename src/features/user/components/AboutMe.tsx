import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Text } from "../../../components/ui/text";
import { formatDate } from "@/utils/TextFormatting";
import { useTranslation } from "react-i18next";

export interface AboutMeProps {
  description?: string;
  memberSince: Date;
}

export default function ({ description, memberSince }: AboutMeProps) {
  const { t } = useTranslation();

  return (
    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{t("text.aboutMe")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>
          {description ? description : t("error.user.emptyDescription")}
        </Text>
      </CardContent>
      <CardFooter className="flex-col items-start">
        <Text className="text-sm font-semibold">{t("text.memberSince")}</Text>
        <Text>{formatDate(memberSince)}</Text>
      </CardFooter>
    </Card>
  );
}
