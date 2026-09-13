import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface DetailsRowProps {
  label: string;
  value: ReactNode;
  showDivider: boolean;
}

export default function DetailsRow({
  label,
  value,
  showDivider,
}: DetailsRowProps) {
  return (
    <View style={[styles.detailRow, showDivider && styles.detailRowDivider]}>
      <Text style={styles.detailLabel}>{label}</Text>
      {typeof value === "string" || typeof value === "number" ? (
        <Text style={styles.detailValue}>{value}</Text>
      ) : (
        <View style={styles.detailValueContainer}>{value}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#42454D",
  },
  detailLabel: {
    color: "#8a8f98",
    fontSize: 16,
  },
  detailValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
    flexShrink: 1,
    marginLeft: 20,
    textAlign: "right",
  },
  detailValueContainer: {
    flex: 1,
    flexShrink: 1,
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
