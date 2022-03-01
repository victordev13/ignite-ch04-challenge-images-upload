import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
  ModalCloseButton,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="transparent">
        <ModalCloseButton />
        <ModalBody padding={0}>
          <Image src={imgUrl} w="100%" h="100%" maxW="900px" maxH="600px" />
        </ModalBody>
        <ModalFooter bg="pGray.800" borderBottomRadius={10}>
          <Link href={imgUrl} target="_blank" rel="noreferrer" mr="auto">
            Abrir Original
          </Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
