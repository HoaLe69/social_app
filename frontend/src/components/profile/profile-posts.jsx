import { Box, Link, Heading, Image, Grid, GridItem } from "@chakra-ui/react";
import { Link as ReactRouterLink } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { getAllPostUser } from "@redux/api-request/posts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const ProfilePostItem = ({ thumbnail, like, id }) => {
  return (
    <Link
      as={ReactRouterLink}
      to={`/post/${id}`}
      position="relative"
      role="group"
    >
      <Box height="400px">
        <Image
          src={thumbnail}
          alt={id}
          height="full"
          width="full"
          objectFit="cover"
        />
      </Box>
      <Box
        position="absolute"
        top={0}
        right={0}
        left={0}
        bottom={0}
        display="none"
        bg={"blackAlpha.500"}
        _groupHover={{ display: "grid" }}
        placeItems="center"
      >
        <Box
          display="flex"
          alignItems="center"
          gap="5px"
          color="whiteAlpha.800"
        >
          {like?.length} <AiFillHeart />
        </Box>
      </Box>
    </Link>
  );
};

const ProfilePost = ({ userId }) => {
  const dispatch = useDispatch();
  const profilePost = useSelector((state) => state.post.getPostUser.posts);
  const accessToken = JSON.parse(localStorage.getItem("user"))?.accessToken;
  useEffect(() => {
    getAllPostUser(dispatch, userId, accessToken);
  }, [userId, dispatch, accessToken]);
  return (
    <Box pt={5}>
      <Heading
        textAlign="center"
        fontSize={"md"}
        textUnderlineOffset={4}
        textDecoration="underline"
        textDecorationThickness={4}
        textDecorationColor="gray.500"
      >
        All post
      </Heading>
      <Grid
        templateColumns={{
          base: "repeat(2, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3 , 1fr)",
          lg: "repeat(3 , 1fr) ",
        }}
        gap={2}
        pt={4}
      >
        {profilePost.map((data) => {
          return (
            <GridItem key={data.id}>
              <ProfilePostItem {...data} />
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ProfilePost;
