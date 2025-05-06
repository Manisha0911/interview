import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
  Loader,
  Center,
  Grid,
  Anchor,
  Container,
} from '@mantine/core';
import { useEffect, useState } from 'react';

type Mission = {
  name: string;
  flight: number;
};

type Position = {
  latitude: number;
  longitude: number;
};

type Ship = {
  ship_id: string;
  ship_name: string;
  ship_model: string | null;
  ship_type: string;
  roles: string[];
  active: boolean;
  imo: number;
  mmsi: number;
  abs: number | null;
  class: string | null;
  weight_lbs: number;
  weight_kg: number;
  year_built: number;
  home_port: string;
  status: string;
  speed_kn: number;
  course_deg: number;
  position: Position;
  successful_landings: number | null;
  attempted_landings: number | null;
  missions: Mission[];
  url: string;
  image: string | null;
};

export default function ShipDetails() {
  const { shipId } = useParams();
  const navigate = useNavigate();
  const [ship, setShip] = useState<Ship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShip = async () => {
      try {
        const res = await fetch(`https://api.spacexdata.com/v3/ships/${shipId}`);
        const data = await res.json();
        setShip(data);
      } catch (error) {
        console.error('Error fetching ship:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShip();
  }, [shipId]);

  if (loading) {
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );
  }

  if (!ship) {
    return (
      <Center mt="xl">
        <Text color="red">Ship not found</Text>
      </Center>
    );
  }

  return (
    <Container size="md" my="xl">
    <Card shadow="lg" padding="xl" radius="lg" withBorder style={{ backgroundColor: "#f9f9ff" }}>
      <Group position="apart" mb="xl">
        <Text fw={700} size="xl" c="indigo.7">
          {ship.ship_name}
        </Text>
        <Button variant="light" color="gray" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Group>
  
      {ship.image && (
        <Image
          src={ship.image}
          alt={ship.ship_name}
          height={250}
          radius="md"
          mb="xl"
          fit="cover"
          withPlaceholder
        />
      )}
  
      <Grid gutter="md">
        <Grid.Col span={6}><strong>ID:</strong> {ship.ship_id}</Grid.Col>
        <Grid.Col span={6}><strong>Model:</strong> {ship.ship_model || 'N/A'}</Grid.Col>
        <Grid.Col span={6}><strong>Type:</strong> {ship.ship_type}</Grid.Col>
        <Grid.Col span={6}>
          <strong>Status:</strong>{' '}
          <Badge color={ship.active ? 'green' : 'gray'} variant="light" radius="sm">
            {ship.active ? 'Active' : 'Inactive'}
          </Badge>
        </Grid.Col>
        <Grid.Col span={6}><strong>Home Port:</strong> {ship.home_port}</Grid.Col>
        <Grid.Col span={6}><strong>Year Built:</strong> {ship.year_built}</Grid.Col>
        <Grid.Col span={6}><strong>Weight:</strong> {ship.weight_kg} kg / {ship.weight_lbs} lbs</Grid.Col>
        <Grid.Col span={6}><strong>Speed:</strong> {ship.speed_kn} kn</Grid.Col>
        <Grid.Col span={6}><strong>Course:</strong> {ship.course_deg}°</Grid.Col>
        <Grid.Col span={6}><strong>Status Description:</strong> {ship.status}</Grid.Col>
        <Grid.Col span={6}><strong>IMO:</strong> {ship.imo}</Grid.Col>
        <Grid.Col span={6}><strong>MMSI:</strong> {ship.mmsi}</Grid.Col>
        <Grid.Col span={6}><strong>ABS:</strong> {ship.abs ?? 'N/A'}</Grid.Col>
        <Grid.Col span={6}><strong>Class:</strong> {ship.class ?? 'N/A'}</Grid.Col>
        <Grid.Col span={6}><strong>Successful Landings:</strong> {ship.successful_landings ?? 'N/A'}</Grid.Col>
        <Grid.Col span={6}><strong>Attempted Landings:</strong> {ship.attempted_landings ?? 'N/A'}</Grid.Col>
        <Grid.Col span={6}><strong>Latitude:</strong> {ship.position.latitude}</Grid.Col>
        <Grid.Col span={6}><strong>Longitude:</strong> {ship.position.longitude}</Grid.Col>
  
        <Grid.Col span={12}>
          <strong>Roles:</strong>{' '}
          {ship.roles.map((role) => (
            <Badge key={role} color="blue" radius="sm" variant="light" mr={6}>
              {role}
            </Badge>
          ))}
        </Grid.Col>
  
        <Grid.Col span={12}>
          <strong>Missions:</strong>
          <ul style={{ marginTop: 6, marginLeft: 20 }}>
            {ship.missions.map((m) => (
              <li key={m.flight}>
                <Text size="sm">{m.name} (Flight #{m.flight})</Text>
              </li>
            ))}
          </ul>
        </Grid.Col>
  
        <Grid.Col span={12} mt="md">
          <strong>More Info:</strong>{' '}
          <Anchor href={ship.url} target="_blank" rel="noopener noreferrer" color="blue.6">
            MarineTraffic
          </Anchor>
        </Grid.Col>
      </Grid>
    </Card>
  </Container>
  
  );
}