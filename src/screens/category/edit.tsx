import React from "react";
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
    Text,
    Pressable,
    Alert
} from "react-native";
import LoadingScreen from "../../components/Loader";
import AuthScreen from "../../components/AuthScreen";
import { CategoryService } from "../../apiService/core";
import GloabalService from "../../apiService/globalService/GloabalService";
import { COLORS } from "../../constant";
import { Button, Icon, Input } from "@rneui/themed";

const { width, height } = Dimensions.get('window');

interface Props {
    navigation: any;
    route: any;
}

interface State {
    isLoading: boolean;
    Token: string;
    Name: string;
    Description: string;
    Url: string;
    Organization: string;
    organizationList: [];
    Id: number;
    category: any;
    CreatedDate: string;
    CategoryId: string;
}

export default class EditCategoryScreen extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: false,
            Id: this.props.route?.params?.Id,
            Token: '',
            Name: '',
            CategoryId: '',
            Description: '',
            Url: '',
            category: [],
            Organization: '',
            CreatedDate: '',
            organizationList: []
        }
    }

    componentDidMount() {
        this.getOrganizationList();
        this.getCategory();
    }

    getCategory = async () => {
        try {
            this.setState({isLoading: true})
            const response = await CategoryService.getCategory(this.state.Id);
            const { data } = response;
            this.setState({
                isLoading: false,
                category: data.Result,
                CategoryId: data.Result?.Id,
                Name: data.Result?.Name,
                Organization: data.Result?.OrganizationId,
                Url: data.Result?.Url,
                Description: data.Result?.Description,
                CreatedDate: data.Result?.CreatedDate,
            });

        } catch (error) {
            this.setState({ isLoading: false });
        }
    };
    

    editCategory = () => {
        let payload = {
            "Id": this.state.Id,
            "Name": this.state.Name,
            "OrganizationId": this.state.Organization,
            "Url": this.state.Url,
            "Description": this.state.Description,
            "CreatedDate": this.state.CreatedDate,
        }
        CategoryService.editCategory(payload)
            .then((res) => {
                console.log(res);
                this.setState({ isLoading: false });
                this.getCategory();
                this.props.navigation.goBack()
                ToastAndroid.show('Category edited successfully!', ToastAndroid.SHORT);
            })
            .catch(() => {
                this.setState({ isLoading: false });
                ToastAndroid.show('Something went wrong.', ToastAndroid.SHORT);
            });
    }


    getOrganizationList = () => {
        GloabalService.getOrganizationList()
            .then(response => {
                this.setState({ isLoading: false, organizationList: response.data.Result });
            })
            .catch(() => {
                this.setState({ isLoading: false });
            });
    }

    render() {
        let { backGround, inputLabelText, inputContainerStyle } = styles
        let { organizationList } = this.state
        return (
            <View style={backGround}>
                {this.state.isLoading ? <LoadingScreen /> :
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.flexMiddle}>
                                <Input
                                inputContainerStyle={inputContainerStyle}
                                    placeholder="Enter name..."
                                    label="Name"
                                    labelStyle={inputLabelText}
                                    underlineColorAndroid='transparent'
                                    value={this.state.Name || ''}
                                    onChangeText={(val) => this.setState({ Name: val })}
                                />
                                <Input
                                   inputContainerStyle={inputContainerStyle}
                                    placeholder="Enter url..."
                                    label="Url"
                                    labelStyle={inputLabelText}
                                    underlineColorAndroid='transparent'
                                    value={this.state.Url || ''}
                                    onChangeText={(val) => this.setState({ Url: val })}
                                />
                                <Input
                                    inputContainerStyle={inputContainerStyle}
                                    placeholder="Enter description..."
                                    label="Description"
                                    labelStyle={inputLabelText}
                                    value={this.state.Description || ''}
                                    underlineColorAndroid="transparent"
                                    multiline={true}
                                    numberOfLines={3}
                                    onChangeText={(val) => this.setState({ Description: val })}
                                />
                            <Pressable style={styles.addButton}>
                                <Button color="primary" onPress={this.editCategory}>
                                    <Text style={{ fontSize: 20, fontWeight: "bold", color: COLORS.WHITE }} >
                                        Edit
                                    </Text>
                                </Button>
                            </Pressable>
                        </View>
                    </ScrollView>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flexMiddle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    flexCenter: {
        flex: 1,
        alignItems: 'center',
        alignSelf: 'center',
    },

    backGround: {
        backgroundColor: COLORS.PAGE_BGCOLOR,
        borderRadius: 10,
        height: '98%',
        margin: 10
    },

    inputLabelText: {
        color: COLORS.PRIMARY,
        fontWeight: "800",
        fontSize: 18
    },

    addButton: {
        width: width * 0.9,
        marginTop: 25,
    },

    inputContainerStyle: {

        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5,
        textAlignVertical: "top",
        borderColor: COLORS.BORDER,
        backgroundColor: '#FFFFFF',
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        shadowOpacity: 0.05,
        elevation: 2,
    },
});