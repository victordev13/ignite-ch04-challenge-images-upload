import { SimpleGrid, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards }: CardsProps): JSX.Element {
  const [currentImageView, setCurrentImageView] = useState<string | null>(null);
  const { isOpen, onClose, onOpen } = useDisclosure();

  const handleViewImage = (url: string): void => {
    setCurrentImageView(url);
    onOpen();
  };

  return (
    <>
      <SimpleGrid columns={3} spacing="40px">
        {cards.map(card => (
          <Card data={card} viewImage={handleViewImage} />
        ))}
      </SimpleGrid>

      <ModalViewImage
        isOpen={isOpen}
        imgUrl={currentImageView}
        onClose={() => {
          setCurrentImageView(null);
          onClose();
        }}
      />
    </>
  );
}
