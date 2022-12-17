"""init

Revision ID: e1dfbbf91815
Revises: 
Create Date: 2022-12-12 17:32:33.914170

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'e1dfbbf91815'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('City',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_City_id'), 'City', ['id'], unique=False)
    op.create_index(op.f('ix_City_name'), 'City', ['name'], unique=False)
    op.create_table('User',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('uuid', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('surname', sa.String(length=100), nullable=False),
    sa.Column('patronymic', sa.String(length=100), nullable=True),
    sa.Column('is_admin', sa.Boolean(), server_default=sa.text('false'), nullable=False),
    sa.Column('time_created', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
    sa.Column('time_updated', sa.DateTime(timezone=True), nullable=True),
    sa.Column('phone', sa.String(), nullable=True),
    sa.Column('photo', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('user_id')
    )
    op.create_index(op.f('ix_User_email'), 'User', ['email'], unique=True)
    op.create_index(op.f('ix_User_user_id'), 'User', ['user_id'], unique=False)
    op.create_index(op.f('ix_User_uuid'), 'User', ['uuid'], unique=True)
    op.create_table('Event',
    sa.Column('event_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('uuid', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('uuid_edit', postgresql.UUID(), server_default=sa.text('gen_random_uuid()'), nullable=False),
    sa.Column('date_start', sa.DateTime(timezone=True), nullable=True),
    sa.Column('date_end', sa.DateTime(timezone=True), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('latitude', sa.Float(), nullable=True),
    sa.Column('longitude', sa.Float(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('responsible_id', sa.Integer(), nullable=True),
    sa.Column('visibility', sa.Boolean(), nullable=True),
    sa.Column('photo_cover', sa.String(), nullable=True),
    sa.Column('key_invite', sa.String(length=10), nullable=True),
    sa.ForeignKeyConstraint(['responsible_id'], ['User.user_id'], ),
    sa.PrimaryKeyConstraint('event_id')
    )
    op.create_index(op.f('ix_Event_event_id'), 'Event', ['event_id'], unique=False)
    op.create_index(op.f('ix_Event_uuid'), 'Event', ['uuid'], unique=True)
    op.create_index(op.f('ix_Event_uuid_edit'), 'Event', ['uuid_edit'], unique=True)
    op.create_table('RefreshToken',
    sa.Column('token_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('refresh_session', postgresql.UUID(), nullable=False),
    sa.Column('expires_in', sa.BigInteger(), nullable=False),
    sa.Column('time_created', sa.DateTime(timezone=True), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['User.user_id'], ),
    sa.PrimaryKeyConstraint('token_id')
    )
    op.create_table('Participant',
    sa.Column('participant_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('is_editor', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['Event.event_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['User.user_id'], ),
    sa.PrimaryKeyConstraint('participant_id'),
    sa.UniqueConstraint('event_id', 'user_id', name='user_pk')
    )
    op.create_table('Stage',
    sa.Column('stage_id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('date_start', sa.DateTime(timezone=True), nullable=True),
    sa.Column('date_end', sa.DateTime(timezone=True), nullable=True),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('visibility', sa.Boolean(), nullable=True),
    sa.Column('event_id', sa.Integer(), nullable=True),
    sa.Column('number', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['event_id'], ['Event.event_id'], ),
    sa.PrimaryKeyConstraint('stage_id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('Stage')
    op.drop_table('Participant')
    op.drop_table('RefreshToken')
    op.drop_index(op.f('ix_Event_uuid_edit'), table_name='Event')
    op.drop_index(op.f('ix_Event_uuid'), table_name='Event')
    op.drop_index(op.f('ix_Event_event_id'), table_name='Event')
    op.drop_table('Event')
    op.drop_index(op.f('ix_User_uuid'), table_name='User')
    op.drop_index(op.f('ix_User_user_id'), table_name='User')
    op.drop_index(op.f('ix_User_email'), table_name='User')
    op.drop_table('User')
    op.drop_index(op.f('ix_City_name'), table_name='City')
    op.drop_index(op.f('ix_City_id'), table_name='City')
    op.drop_table('City')
    # ### end Alembic commands ###