import {
  Button,
  Container,
  Flex,
  Image,
  SimpleGrid,
  Title,
} from "@mantine/core";

import { useEffect, useState } from "react";

// const bastUrl = "http://127.0.0.1:5001/api/v1";
const bastUrl = "https://photier.arneca.com/api/v1";
const images = [
  "https://www.fcbarcelona.com/fcbarcelona/photo/2022/11/18/1b9424b9-c38c-4b50-b959-cf6358064950/mini_all-convos.png",
  "https://www.fcbarcelona.com/photo-resources/2021/04/13/ecd2ec4a-8981-4b26-afcf-dd885cccfcb6/3200x2000-foto_oficial-rakuten.jpeg?width=1200&height=750",
  "https://cdn.theathletic.com/app/uploads/2023/02/09155709/Barcelona-contracts-1-1024x683.png",
  "https://i.ytimg.com/vi/dfc2azRdQ_M/maxresdefault.jpg",
  "https://i.ytimg.com/vi/k6O6b0YyaIA/maxresdefault.jpg",
  "https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/blt19a82442761b60bb/631ac4a39b09807209ccfe52/%EA%B0%88%EB%9D%BC%ED%83%80%EC%82%AC%EB%9D%BC%EC%9D%B4.jpg",
  "https://cdn1.ntv.com.tr/gorsel/QXUWiZD4MU6tBsjgAuN2Ag.jpg",
  "https://i.ytimg.com/vi/bwNzRNjjxtk/maxresdefault.jpg",
  "https://cdn.vox-cdn.com/thumbor/FG8ATXquwjDP1XdDhd3uJamefW4=/0x0:4896x3304/1200x800/filters:focal(2429x395:3211x1177)/cdn.vox-cdn.com/uploads/chorus_image/image/72676600/1692812231.0.jpg",
];
const App = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [databaseImages, setDatabaseImages] = useState([]);
  const onSelectImagesToUpload = (image) => {
    if (selectedImages.includes(image)) {
      setSelectedImages(selectedImages.filter((i) => i !== image));
    } else {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const onUpload = async () => {
    setIsLoading(true);
    const images =
      selectedImages &&
      selectedImages.map((image) => {
        return {
          _id: Math.ceil(Math.random() * 1000), // photo id from node db
          url: image,
          thumb: image,
          type: "image",
          mimeType: "image/jpeg",
          duration: null,
          width: 750,
          height: 1666,
          target_id: "AM9HkKmCBPZzTtlS_sQW1Ib_ycZAzeWSvgs", // user_id veya post_id
          target: "post", // veya user
        };
      });

    for (let image of images) {
      const response = await fetch(`${bastUrl}/create_one`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(image),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    }
    await fetchImages();
    setSelectedImages([])
    setIsLoading(false);
  };
  const onClearDatabase = async () => {
    setIsClearing(true);
    const allImages = await fetch(`${bastUrl}/get-all`);
    const data = await allImages.json();

    for (let image of data) {
      const url = image.url;
      const response = await fetch(`${bastUrl}/delete_one?url=${url}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      }
    }
    await fetchImages();
    setSelectedImages([])
    setIsClearing(false);
  };

  const fetchImages = async () => {
    const allImages = await fetch(`${bastUrl}/get-all`);
    const data = await allImages.json();
    setDatabaseImages(data.map((image) => image.url));
  };

  useEffect(() => {
    fetchImages();
  }, []);
  return (
    <Container size={"xl"}>
      <Title my={"md"}>Select Images to upload</Title>
      <SimpleGrid spacing={"md"} cols={{ base: 1, md: 6 }}>
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            height={"100%"}
            width={"100%"}
            fit="cover"
            onClick={() => onSelectImagesToUpload(image)}
            className={
              selectedImages.includes(image) ? "selected-image" : "image"
            }
          />
        ))}
      </SimpleGrid>

      <Title my={"md"}>Database Images</Title>
      <SimpleGrid spacing={"md"} cols={{ base: 1, md: 6 }}>
        {databaseImages.map((image, index) => (
          <Image
            key={index}
            src={image}
            height={"100%"}
            width={"100%"}
            fit="cover"
            onClick={() => onSelectImagesToUpload(image)}
            className={"image"}
          />
        ))}
      </SimpleGrid>
      <Flex gap="md">
        <Button
          loading={isLoading}
          disabled={isLoading}
          onClick={onUpload}
          mt={"md"}
        >
          Upload Selected
        </Button>
        <Button
          loading={isClearing}
          disabled={isClearing}
          onClick={onClearDatabase}
          mt={"md"}
          color="red"
        >
          Clear Database
        </Button>
      </Flex>
    </Container>
  );
};

export default App;
