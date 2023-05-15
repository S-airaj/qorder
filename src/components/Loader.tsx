import React, { Component } from "react";
import { ActivityIndicator } from "react-native";
import { COLORS } from "../constant";

interface LoadingScreenProps { }

export default class LoadingScreen extends React.Component<LoadingScreenProps> {
    render() {
        return (
            <ActivityIndicator
                size="large"
                color={COLORS.PRIMARY}
                style={{
                    position: 'absolute', left: 0, right: 0, bottom: 0, top: 0
                }}
            />
        )
    }
}