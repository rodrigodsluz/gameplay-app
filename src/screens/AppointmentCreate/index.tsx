import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import uuid from "react-native-uuid";

import { Background } from "../../components/Background";
import { Button } from "../../components/Button";
import { CategorySelect } from "../../components/CategorySelect";
import { Feather } from "@expo/vector-icons";
import { GuildIcon } from "../../components/GuildIcon";
import { Header } from "../../components/Header";
import { RectButton } from "react-native-gesture-handler";
import { SmallInput } from "../../components/SmallInput";
import { TextArea } from "../../components/TextArea";
import { styles } from "./styles";
import { theme } from "../../global/styles/theme";
import { ModalView } from "../../components/ModalView";
import { Guilds } from "../Guilds";
import { GuildProps } from "../../components/Guild";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { COLLECTION_APPOINTMENTS } from "../../configs/database";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
};

type homeScreenProp = StackNavigationProp<RootStackParamList>;

export function AppointmentCreate() {
  const [category, setCategory] = useState<string>("");
  const [openGuildsModal, setOpenGuildsModal] = useState(false);
  const [guild, setGuild] = useState<GuildProps>({} as GuildProps);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [description, setDescription] = useState("");

  const navigation = useNavigation<homeScreenProp>();

  function handleOpenGuilds() {
    setOpenGuildsModal(true);
  }

  function handleCloseGuilds() {
    setOpenGuildsModal(false);
  }

  function handleGuildSelect(guildSelect: GuildProps) {
    setGuild(guildSelect);
    setOpenGuildsModal(false);
  }

  const handleSelectedCategory = (categoryId: string) => {
    setCategory(categoryId);
  };

  async function handleSave() {
    const newAppointment = {
      id: uuid.v4(),
      guild,
      category,
      date: `${day}/${month} às ${hour}:${minute}h`,
      description,
    };

    const storage = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const appointments = storage ? JSON.parse(storage) : [];

    await AsyncStorage.setItem(
      COLLECTION_APPOINTMENTS,
      JSON.stringify([...appointments, newAppointment])
    );

    navigation.navigate("Home");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Background>
        <ScrollView>
          <Header title="Schedule match" />

          <Text
            style={[
              styles.label,
              { marginLeft: 24, marginTop: 36, marginBottom: 18 },
            ]}
          >
            Category
          </Text>

          <CategorySelect
            hasCheckBox
            setCategory={handleSelectedCategory}
            selectedCategory={category}
          />

          <View style={styles.form}>
            <RectButton onPress={handleOpenGuilds}>
              <View style={styles.select}>
                {guild.icon ? (
                  <GuildIcon guildId={guild.id} iconId={guild.icon} />
                ) : (
                  <View style={styles.image} />
                )}

                <View style={styles.selectBody}>
                  <Text style={styles.label}>
                    {guild.name ? guild.name : "Select a server"}Ï
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={theme.colors.heading}
                />
              </View>
            </RectButton>

            <View style={styles.field}>
              <View>
                <Text style={[styles.label, { marginBottom: 12 }]}>
                  Day and month
                </Text>

                <View style={styles.column}>
                  <SmallInput maxLength={2} onChangeText={setDay} />
                  <Text style={styles.divider}>/</Text>
                  <SmallInput maxLength={2} onChangeText={setMonth} />
                </View>
              </View>

              <View>
                <Text style={[styles.label, { marginBottom: 12 }]}>
                  Hour and minute
                </Text>

                <View style={styles.column}>
                  <SmallInput maxLength={2} onChangeText={setHour} />
                  <Text style={styles.divider}>:</Text>
                  <SmallInput maxLength={2} onChangeText={setMinute} />
                </View>
              </View>
            </View>

            <View style={[styles.field, { marginBottom: 12 }]}>
              <Text style={styles.label}>Description</Text>

              <Text style={styles.caracteresLimit}>Max 100 caracters</Text>
            </View>

            <TextArea
              multiline
              maxLength={100}
              numberOfLines={5}
              autoCorrect={false}
              onChangeText={setDescription}
            />

            <View style={styles.footer}>
              <Button title="Schedule" onPress={handleSave} />
            </View>
          </View>
        </ScrollView>
      </Background>
      <ModalView visible={openGuildsModal} closeModal={handleCloseGuilds}>
        <Guilds handleGuildSelect={handleGuildSelect} />
      </ModalView>
    </KeyboardAvoidingView>
  );
}
